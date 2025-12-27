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

        // ------------------------------------------------------------------ Login APIs  ------------------------------------------------------------------

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

        // ------------------------------------------------------------------ Profile APIs ------------------------------------------------------------------

        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetProfile(ulong userId)
        {
            var user = await _context.Users
                .Select(u => new
                {
                    u.UserId,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.RoleId,
                    u.Headline,
                    u.Biography,
                    u.ProfilePictureUrl,
                    u.CreatedAt
                })
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);
        }

        [HttpPut("change-password/{userId}")]
        public async Task<IActionResult> ChangePassword(ulong userId, [FromBody] ChangePasswordDto request)
        {
            var authRecord = await _context.Authidentities
                .FirstOrDefaultAsync(ai => ai.UserId == userId && ai.Provider == "Local");

            if (authRecord == null)
            {
                return NotFound("User authentication record not found.");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, authRecord.PasswordHash);
            if (!isPasswordValid)
            {
                return Unauthorized("Invalid current password.");
            }

            authRecord.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "An error occurred while updating the password.");
            }

            return Ok(new { message = "Password updated successfully." });
        }

        [HttpPut("change-email/{userId}")]
        public async Task<IActionResult> ChangeEmail(ulong userId, [FromBody] ChangeEmailDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.NewEmail))
            {
                return BadRequest("Email is already in use.");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var authRecord = await _context.Authidentities
                .FirstOrDefaultAsync(ai => ai.UserId == userId && ai.Provider == "Local");

            user.Email = request.NewEmail;

            if (authRecord != null)
            {
                authRecord.ProviderKey = request.NewEmail;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "An error occurred while updating the email.");
            }

            return Ok(new { message = "Email updated successfully.", newEmail = user.Email });
        }

        [HttpPut("update-details/{userId}")]
        public async Task<IActionResult> UpdateProfileDetails(long userId, [FromBody] UpdateProfileDetailsDto request)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Headline = request.Headline;
            user.Biography = request.Biography;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "An error occurred while updating profile details.");
            }

            return Ok(new { message = "Profile details updated successfully.", user });
        }

        [HttpPut("update-picture/{userId}")]
        public async Task<IActionResult> UpdateProfilePicture(long userId, [FromBody] UpdateProfilePictureDto request)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.ProfilePictureUrl = request.ProfilePictureUrl;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "An error occurred while updating the profile picture.");
            }

            return Ok(new { message = "Profile picture updated successfully.", profilePictureUrl = user.ProfilePictureUrl });
        }
    }
}