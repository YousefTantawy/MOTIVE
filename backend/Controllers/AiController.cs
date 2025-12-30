using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;

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

        [HttpPost("recommend")]
        public async Task<IActionResult> GetRecommendation([FromBody] object data)
        {
            // 1. Create the Client
            var client = _httpClientFactory.CreateClient("AiService");

            // 2. Serialize the incoming data to send to Python
            var jsonContent = new StringContent(
                JsonSerializer.Serialize(data),
                Encoding.UTF8,
                "application/json");

            try
            {
                // 3. Send POST request to Python (adjust endpoint '/predict' as needed)
                var response = await client.PostAsync("predict", jsonContent);

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Error communicating with AI Service");
                }

                // 4. Read response string
                var result = await response.Content.ReadAsStringAsync();

                // 5. Return result to frontend
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}