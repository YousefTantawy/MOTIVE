using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Models;
using MotiveBackend.DTOs;

namespace MotiveBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly Ecen424DbProjectContext _context;
        public AdminController(Ecen424DbProjectContext context)
        {
            _context = context;
        }

        [HttpGet("StudentCount")]
        public async Task<IActionResult> GetStudentsCount()
        {
            var students = await _context.Users.CountAsync(u => u.RoleId == 3);

            return Ok(new { students = students });
        }

        [HttpGet("InstructorsCount")]
        public async Task<IActionResult> GetInstructorsCount()
        {
            var Instructors = await _context.Users.CountAsync(u => u.RoleId == 2);

            return Ok(new { Instructors = Instructors });
        }

        [HttpGet("CoursesCount")]
        public async Task<IActionResult> GetCoursesCount()
        {
            var courses = await _context.Courses
            .CountAsync();

            return Ok(new { courses = courses });
        }

        [HttpGet("AuditLogs")]
        public async Task<IActionResult> GetAuditLogs()
        {
            var logs = await _context.AuditLogs
                .Include(a => a.User)
                .Include(a => a.AuditLogDetails)
                .OrderByDescending(a => a.Timestamp)
                .Select(a => new
                {
                    a.LogId,
                    User = a.User != null ? $"{a.User.FirstName} {a.User.LastName}" : "System/Unknown",
                    Action = a.ActionType,
                    Entity = a.EntityAffected,
                    TargetId = a.EntityId,
                    Time = a.Timestamp,
                    Changes = a.AuditLogDetails.Select(d => new
                    {
                        Field = d.FieldName,
                        Old = d.OldValue,
                        New = d.NewValue
                    }).ToList()
                })
                .ToListAsync();

            return Ok(logs);
        }

        [HttpGet("LoginEvents")]
        public async Task<IActionResult> GetLoginEvents()
        {
            var events = await _context.LoginEvents
                .Include(e => e.User)
                .OrderByDescending(e => e.AttemptTime)
                .Select(e => new
                {
                    e.EventId,
                    User = e.User != null ? $"{e.User.FirstName} {e.User.LastName}" : "Unknown User",
                    Email = e.User != null ? e.User.Email : "N/A",
                    Time = e.AttemptTime,
                    Success = e.IsSuccessful,
                    IP = e.IpAddress,
                    Reason = e.FailureReason
                })
                .ToListAsync();

            return Ok(events);
        }

        [HttpDelete("user/{userId}")]
        public async Task<IActionResult> DeleteUser(ulong userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully." });
        }

        [HttpDelete("course/{courseId}")]
        public async Task<IActionResult> DeleteCourse(ulong courseId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Course deleted successfully." });
        }
    }
}
