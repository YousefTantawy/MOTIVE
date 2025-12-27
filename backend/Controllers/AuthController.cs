using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Data;
using MotiveBackend.Models;
using MotiveBackend.Models.DTOs;
using BCrypt.Net; // Import the hashing tool

namespace MotiveBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Ecen424DbProjectContext _context;

        public AuthController(Ecen424DbProjectContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("Email is already registered.");
            }

            if (request.RoleId != 2 && request.RoleId != 3)
            {
                return BadRequest("Invalid Role selected. Only Student (3) or Instructor (2) allowed.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                RoleId = request.RoleId,
                CreatedAt = DateTime.Now
            };

            var newAuth = new Authidentity
            {
                User = newUser,
                Provider = "Local",
                ProviderKey = request.Email,
                PasswordHash = passwordHash
            };

            _context.Authidentities.Add(newAuth);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful!", userId = newUser.UserId });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var authRecord = await _context.Authidentities
                .Include(ai => ai.User)
                .ThenInclude(u => u.Role)
                .FirstOrDefaultAsync(ai => ai.ProviderKey == request.Email && ai.Provider == "Local");

            if (authRecord == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, authRecord.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid credentials.");
            }

            return Ok(new
            {
                message = "Login successful",
                userId = authRecord.UserId,
                roleId = authRecord.User.Role.RoleId
            });
        }
    }
}