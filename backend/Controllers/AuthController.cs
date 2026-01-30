using BCrypt.Net; // Import the hashing tool
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Models;
using MotiveBackend.DTOs;

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
                await LogLoginAttempt(null, false, "Email already exists");
                return BadRequest("Email is already registered.");
            }

            if (request.RoleId != 2 && request.RoleId != 3)
            {
                await LogLoginAttempt(null, false, "Role mismatch error");
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
                PasswordHash = passwordHash,
                LastLogin = DateTime.Now
            };

            _context.Authidentities.Add(newAuth);
            await _context.SaveChangesAsync();

            await LogLoginAttempt(newUser.UserId, true, null);

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
                await LogLoginAttempt(null, false, "Invalid credentials.");
                return Unauthorized("Invalid credentials.");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, authRecord.PasswordHash);

            if (!isPasswordValid)
            {
                await LogLoginAttempt(null, false, "Invalid credentials.");
                return Unauthorized("Invalid credentials.");
            }

            await LogLoginAttempt(authRecord.UserId, true, null);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Login successful",
                userId = authRecord.UserId,
                roleId = authRecord.User.Role.RoleId
            });
        }

        private async Task LogLoginAttempt(ulong? userId, bool isSuccess, string? failureReason)
        {
            var loginEvent = new LoginEvent
            {
                UserId = userId,
                AttemptTime = DateTime.Now,
                IsSuccessful = isSuccess,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = Request.Headers["User-Agent"].ToString(),
                FailureReason = failureReason
            };

            _context.LoginEvents.Add(loginEvent);
            await _context.SaveChangesAsync();
        }

        // ------------------------------------------------------------------ Profile APIs ------------------------------------------------------------------

        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetProfile(ulong userId)
        {
            var user = await _context.Users
                .Include(u => u.UserPhones)
                .Include(u => u.UserLinks)
                .Where(u => u.UserId == userId)
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
                    u.CreatedAt,
                    PhoneNumbers = u.UserPhones.Select(p => p.PhoneNumber).ToList(),
                    Links = u.UserLinks.Select(l => new
                    {
                        l.PlatformName,
                        l.Url
                    }).ToList()
                })
                .FirstOrDefaultAsync();

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
        public async Task<IActionResult> UpdateProfileDetails(ulong userId, [FromBody] UpdateProfileDetailsDto request)
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
        public async Task<IActionResult> UpdateProfilePicture(ulong userId, [FromBody] UpdateProfilePictureDto request)
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(ulong id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            _context.Users.Remove(user);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Error deleting user: {ex.InnerException?.Message ?? ex.Message}");
            }

            return Ok(new { message = "User and all related data deleted successfully." });
        }

        [HttpPut("{userId}/phones")]
        public async Task<IActionResult> UpdateUserPhones(ulong userId, [FromBody] UpdateUserPhonesDto request)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
            if (!userExists)
            {
                return NotFound("User not found.");
            }

            var currentPhones = await _context.UserPhones
                .Where(p => p.UserId == userId)
                .ToListAsync();

            _context.UserPhones.RemoveRange(currentPhones);

            if (request.PhoneNumbers != null && request.PhoneNumbers.Any())
            {
                var newPhones = request.PhoneNumbers.Select(num => new UserPhone
                {
                    UserId = userId,
                    PhoneNumber = num
                });

                await _context.UserPhones.AddRangeAsync(newPhones);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "Error updating phone numbers.");
            }

            return Ok(new { message = "Phone numbers updated successfully.", phones = request.PhoneNumbers });
        }

        [HttpPut("{userId}/links")]
        public async Task<IActionResult> UpdateUserLinks(ulong userId, [FromBody] UpdateUserLinksDto request)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
            if (!userExists)
            {
                return NotFound("User not found.");
            }

            var currentLinks = await _context.UserLinks
                .Where(l => l.UserId == userId)
                .ToListAsync();

            _context.UserLinks.RemoveRange(currentLinks);

            if (request.Links != null && request.Links.Any())
            {
                var newLinks = request.Links.Select(link => new UserLink
                {
                    UserId = userId,
                    PlatformName = link.PlatformName,
                    Url = link.Url
                });

                await _context.UserLinks.AddRangeAsync(newLinks);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "An error occurred while updating user links.");
            }

            return Ok(new { message = "Links updated successfully.", links = request.Links });
        }
    }
}