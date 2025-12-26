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
            // 1. Trending (Wait for it to finish)
            var trending = await _context.ViewMostTrendings
                                         .Take(10)
                                         .ToListAsync();

            // 2. Top Rated (Wait for it to finish)
            var topRated = await _context.ViewTopRateds
                                         .Take(10)
                                         .ToListAsync();

            // 3. Newest (Wait for it to finish)
            var newest = await _context.ViewMostRecents
                                       .Take(10)
                                       .ToListAsync();

            // 4. Best Sellers (Wait for it to finish)
            var bestSellers = await _context.ViewMostEnrolleds
                                            .Take(10)
                                            .ToListAsync();

            // 5. Return everything
            return Ok(new
            {
                Trending = trending,
                TopRated = topRated,
                Newest = newest,
                BestSellers = bestSellers
            });
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
                    
                    UpdatedAt = c.UpdatedAt,
                    
                    ThumbnailUrl = c.ThumbnailUrl,

                    Objectives = c.CourseDescription.CourseObjectives.Select(o => o.ObjectiveText),

                    Requirements = c.CourseDescription.CourseRequirements.Select(r => r.RequirementText),

                    TargetAudience = c.CourseDescription.CourseTargetAudiences.Select(a => a.AudienceText),

                    Category = c.CourseCategories.Select(cc => cc.Category.Name)
                        .FirstOrDefault() ?? "Uncategorized",
                    Description = c.CourseDescription != null ? c.CourseDescription.FullText : "No description",
                    
                    Reviews = c.UserReviews.Select(ur => new
                    {
                        UserName = ur.User.FirstName + " " + ur.User.LastName,
                        Rating = ur.RatingValue,
                        Comment = ur.Comment,
                        Date = ur.CreatedAt
                    }),

                    Instructor = c.CourseInstructors.Select(ci => new
                    {
                        UserName = ci.User.FirstName + " " + ci.User.LastName,
                    }),

                    Sections = c.Sections.OrderBy(s => s.OrderIndex).Select(s => new
                    {
                        s.SectionId,
                        s.Title,
                        
                        Lessons = s.Lessons
                            .OrderBy(l => l.OrderIndex) 
                            .Select(l => new
                            {
                                l.LessonId,
                                l.Title,    
                            })
                    }),
                })
                .FirstOrDefaultAsync();

            if (course == null) return NotFound("Course not found.");

            return Ok(course);
        }
    }
}