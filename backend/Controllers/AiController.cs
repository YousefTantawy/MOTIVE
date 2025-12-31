using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Motive.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public AiController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("recommendations")]
        public async Task<IActionResult> GetRecommendations([FromBody] int userId)
        {
            // 1. Create the client configured in Program.cs
            var client = _httpClientFactory.CreateClient("PythonAiService");

            // 2. Prepare the data for Python (matches class UserRequest in Python)
            var payload = new { user_id = userId };
            var jsonContent = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            try
            {
                // 3. Send POST to Python endpoint '/get-ids'
                var response = await client.PostAsync("get-ids", jsonContent);

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Error from Python Service");
                }

                // 4. Read the result
                // Python returns: {"status": "success", "ids": [101, 102]}
                var jsonResponse = await response.Content.ReadAsStringAsync();

                var data = System.Text.Json.Nodes.JsonNode.Parse(jsonResponse);
                string status = data?["status"]?.ToString();

                if (status == "cold_start")
                {
                    return StatusCode(204, "Enroll in courses!");
                }

                if (status == "error")
                {
                    return StatusCode(500, "Error in fetching data");
                }

                // 5. Return directly to Frontend
                return Content(jsonResponse, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}