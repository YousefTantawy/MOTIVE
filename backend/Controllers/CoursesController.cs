using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Data;
using MotiveBackend.Models;

namespace MotiveBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly Ecen424DbProjectContext _context;
        public CoursesController(Ecen424DbProjectContext context)
        {
            _context = context;
        }
        // Dbcontext is the connection between database and backend
        // Done using the following command: 
        // Scaffold-DbContext "Server=motivedatabase.mysql.database.azure.com;Database=myshop;User ID=ousefTantawy;Password=el7amamsyel7amamsy!!;SslMode=Required;" Pomelo.EntityFrameworkCore.MySql -OutputDir Models -ContextDir Data -Force
        // Editable depending on the database

        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _context.Courses
                .Select(c => new
                {
                    c.CourseId, 
                    c.Title,
                    Description = c.CourseDescription != null ? c.CourseDescription.FullText : "No description",
                    Reviews = c.UserReviews.Select(r => r.Comment)
                })
                .ToListAsync();

            return Ok(courses);
        }
    }
}