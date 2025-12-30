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

        [HttpGet("courses/{userId}")]
        public async Task<IActionResult> GetInstructorCourses(ulong userId)
        {
            var courses = await _context.Courses
                .Where(c => c.InstructorId == userId)
                .Select(c => new
                {
                    c.CourseId,
                    c.Title,
                    c.Price,
                    c.Thumbnail,
                    c.Category,
                    StudentCount = _context.Enrollments.Count(e => e.CourseId == c.CourseId)
                })
                .ToListAsync();

            return Ok(courses);
        }

        [HttpGet("revenue/{userId}")]
        public async Task<IActionResult> GetTotalRevenue(ulong userId)
        {
            var totalRevenue = await _context.Enrollments
                .Include(e => e.Course)
                .Where(e => e.Course.InstructorId == userId)
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