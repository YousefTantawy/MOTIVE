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
        public async Task<IActionResult> GetCoursesHomePage()
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourseDetail(ulong id)
        {
            var course = await _context.Courses
                .Where(c => c.CourseId == id)
                .Select(c => new
                {
                    Id = c.CourseId,
                    Title = c.Title,
                    Price = c.Price,
                    Language = c.Language,
                    DifficultyLevel = c.DifficultyLevel,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt,
                    ThumbnailUrl = "https://via.placeholder.com/600x400", // to be edited later
                    Category = c.CourseCategories
                        .Select(cc => cc.Category.Name)
                        .FirstOrDefault() ?? "Uncategorized",
                    UpdatedAt = DateTime.Now,

                    Description = c.CourseDescription != null ? c.CourseDescription.FullText : "No description",

                    Reviews = c.UserReviews.Select(r => new
                    {
                        UserName = r.User.FirstName + " " + r.User.LastName,
                        Rating = r.RatingValue,
                        Comment = r.Comment,
                        Date = r.CreatedAt
                    })
                })
                .FirstOrDefaultAsync();

            if (course == null) return NotFound("Course not found.");

            return Ok(course);
        }
    }
}