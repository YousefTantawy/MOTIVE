using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace Motive.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public AiController()
        {
            _httpClient = new HttpClient();
        }

        [HttpGet("get-ai-result")]
        public async Task<IActionResult> CallFastApi(string query)
        {
            // 1. CALL: Send request to FastAPI running on localhost:8000
            // We pass the data in the URL query string
            var response = await _httpClient.GetStringAsync($"http://127.0.0.1:8000/predict?input_val={query}");

            // 2. RECEIVE: Return the Python JSON back to the user
            return Ok(response);
        }
    }