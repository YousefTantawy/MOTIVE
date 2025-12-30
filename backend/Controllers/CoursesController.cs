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
        // Editable depending on the database

        // 1. Trending -> api/Courses/trending
        [HttpGet("trending")]
        public async Task<IActionResult> GetMostTrendings()
        {
            var trending = await _context.ViewMostTrendings.Take(8).ToListAsync();
            return Ok(trending);
        }

        // 2. Recent -> api/Courses/recent
        [HttpGet("recent")]
        public async Task<IActionResult> GetMostRecent()
        {
            var newest = await _context.ViewMostRecents.Take(8).ToListAsync();
            return Ok(newest);
        }

        // 3. Best Sellers -> api/Courses/bestsellers
        [HttpGet("bestsellers")]
        public async Task<IActionResult> ViewBestSellers()
        {
            var bestSellers = await _context.ViewMostEnrolleds.Take(8).ToListAsync();
            return Ok(bestSellers);
        }

        // 4. Top Rated -> api/Courses/toprated
        [HttpGet("toprated")]
        public async Task<IActionResult> ViewTopRated()
        {
            var topRated = await _context.ViewTopRateds.Take(8).ToListAsync();
            return Ok(topRated);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchCourses([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query cannot be empty.");
            }

            var searchResults = await _context.Courses
                .Where(c => c.Title.Contains(query))
                .Select(c => new
                {
                    c.CourseId,
                    c.Title,
                    c.Price,
                    Rating = _context.UserReviews
                        .Where(r => r.CourseId == c.CourseId)
                        .Select(r => (double?)r.RatingValue)
                        .Average() ?? 0
                })
                .ToListAsync();

            return Ok(searchResults);
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

                    Categories = c.CourseCategories
                    .Select(cc => cc.Category.Name)
                    .ToList(),

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