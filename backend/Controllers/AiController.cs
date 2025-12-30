using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text;
using MotiveBackend.Data;
using MotiveBackend.DTOs; 
using MotiveBackend.Models; 

[Route("api/[controller]")]
[ApiController]
public class AIController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly Ecen424DbProjectContext _context;
    public AIController(Ecen424DbProjectContext context)
    {
        _context = context;
    }

    // POST: api/ai/recommendations
    [HttpPost("recommendations")]
    public async Task<IActionResult> GetRecommendations([FromBody] int userId)
    {
        // 1. Prepare data for Python
        var pyRequest = new PyRecommendationRequest { user_id = userId };
        var jsonContent = new StringContent(
            JsonSerializer.Serialize(pyRequest),
            Encoding.UTF8,
            "application/json");

        // 2. Call the Python API
        var client = _httpClientFactory.CreateClient("AIService");

        try
        {
            // Matches Python: @app.post("/get-ids")
            var response = await client.PostAsync("get-ids", jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error communicating with AI Service");
            }

            var responseString = await response.Content.ReadAsStringAsync();

            // 3. Deserialize Python response
            var aiResult = JsonSerializer.Deserialize<PyRecommendationResponse>(responseString, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (aiResult == null || aiResult.ids == null || aiResult.ids.Count == 0)
            {
                return Ok(new { message = "No recommendations found (Cold Start or Error)", courses = new List<object>() });
            }

            // 4. Hydrate IDs -> Real Course Objects
            // We take the IDs from Python and ask the Database for the full details
            var recommendedCourses = await _context.Courses
                .Where(c => aiResult.ids.Contains(c.CourseId))
                .Select(c => new
                {
                    c.CourseId,
                    c.Title,
                    c.Price,
                    // Add any other fields your frontend needs
                })
                .ToListAsync();

            // Optional: Re-order them to match the relevance order from Python
            var orderedCourses = aiResult.ids
                .Select(id => recommendedCourses.FirstOrDefault(c => c.CourseId == id))
                .Where(c => c != null)
                .ToList();

            return Ok(orderedCourses);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal Server Error: {ex.Message}");
        }
    }
}