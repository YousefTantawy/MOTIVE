using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Data;

namespace MotiveBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        // ---------------------------------------------------- Dashboard Page ---------------------------------------------------------------------------------- 

        private readonly Ecen424DbProjectContext _context;
        public DashboardController(Ecen424DbProjectContext context)
        {
            _context = context;
        }

        [HttpGet("user/{userId}/courses")]
        public async Task<IActionResult> GetEnrolledCourseNames(ulong userId)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
            if (!userExists)
            {
                return NotFound("User not found.");
            }

            var enrolledCourses = await _context.Enrollments
                .Where(e => e.UserId == userId)
                .Select(e => new
                {
                    e.CourseId,
                    e.Course.Title
                })
                .ToListAsync();

            return Ok(enrolledCourses);
        }



        // ---------------------------------------------------- This is for course details  ---------------------------------------------------------------------

        
    }    
}
