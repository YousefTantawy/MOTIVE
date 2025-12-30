using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Data;
using MotiveBackend.Models;

namespace MotiveBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudioController : ControllerBase
    {
        private readonly Ecen424DbProjectContext _context;

        public StudioController(Ecen424DbProjectContext context)
        {
            _context = context;
        }

        [HttpGet("ownedcourses/{userId}")]
        public async Task<IActionResult> GetInstructorCourses(ulong userId)
        {
            var courses = await _context.Courses
                .Where(c => _context.CourseInstructors.Any(ci => ci.CourseId == c.CourseId && ci.UserId == userId))
                .Select(c => new
                {
                    c.CourseId,
                    c.Title,
                    c.Price,
                    c.ThumbnailUrl,
                    StudentCount = _context.Enrollments.Count(e => e.CourseId == c.CourseId)
                })
                .ToListAsync();

            return Ok(courses);
        }

        [HttpGet("myrevenue/{userId}")]
        public async Task<IActionResult> GetTotalRevenue(ulong userId)
        {
            var totalRevenue = await _context.Enrollments
                .Include(e => e.Course)
                .Where(e => _context.CourseInstructors.Any(ci => ci.CourseId == e.CourseId && ci.UserId == userId))
                .SumAsync(e => e.Course.Price);

            return Ok(new { UserId = userId, TotalRevenue = totalRevenue });
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCourse()
        {
            return Ok();
        }
    }
}