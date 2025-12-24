using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Models;
using MotiveBackend.Data;

namespace MotiveBackend.Controllers
{
    [Route("api/[controller]")]
    // Name of the api
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly Ecen424DbProjectContext _context;
        public UsersController(Ecen424DbProjectContext context)
        {
            _context = context;
        }
        // Dbcontext is the connection between database and backend
        // Done using the following command: 
        // Scaffold-DbContext "Server=motivedatabase.mysql.database.azure.com;Database=myshop;User ID=ousefTantawy;Password=el7amamsyel7amamsy!!;SslMode=Required;" Pomelo.EntityFrameworkCore.MySql -OutputDir Models -ContextDir Data -Force
        // Editable depending on the database

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            // Debugging Step: Remove the "Role" part for a second.
            // Let's just try to get the raw user data.
            var users = await _context.Users
                .Select(u => new
                {
                    u.UserId,
                    u.FirstName,
                    u.Email
                    // Removed RoleName to test safety
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}