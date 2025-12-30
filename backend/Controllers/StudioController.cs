using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Data;
using MotiveBackend.DTOs;
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
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var newCourse = new Course
                {
                    Title = request.Title,
                    Slug = GenerateSlug(request.Title),
                    Price = request.Price,
                    ThumbnailUrl = request.ThumbnailUrl,
                    Language = request.Language,
                    DifficultyLevel = request.DifficultyLevel,
                    Status = "Draft",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.Courses.Add(newCourse);
                await _context.SaveChangesAsync();

                var instructorLink = new CourseInstructor
                {
                    CourseId = newCourse.CourseId,
                    UserId = request.InstructorId,
                    IsPrimaryAuthor = true,
                    RevenueShare = 100.00m,
                    AssignedAt = DateTime.Now
                };
                _context.CourseInstructors.Add(instructorLink);

                foreach (var catId in request.Category)
                {
                    _context.CourseCategories.Add(new CourseCategory
                    {
                        CourseId = newCourse.CourseId,
                        CategoryId = catId,
                        AssignedAt = DateTime.Now
                    });
                }

                var description = new CourseDescription
                {
                    CourseId = newCourse.CourseId,
                    FullText = request.FullDescription ?? ""
                };
                _context.CourseDescriptions.Add(description);
                await _context.SaveChangesAsync();

                if (request.Objectives.Any())
                {
                    _context.CourseObjectives.AddRange(request.Objectives.Select(obj => new CourseObjective
                    {
                        DescriptionId = description.DescriptionId,
                        ObjectiveText = obj
                    }));
                }

                if (request.Requirements.Any())
                {
                    _context.CourseRequirements.AddRange(request.Requirements.Select(req => new CourseRequirement
                    {
                        DescriptionId = description.DescriptionId,
                        RequirementText = req
                    }));
                }

                if (request.TargetAudiences.Any())
                {
                    _context.CourseTargetAudiences.AddRange(request.TargetAudiences.Select(aud => new CourseTargetAudience
                    {
                        DescriptionId = description.DescriptionId,
                        AudienceText = aud
                    }));
                }

                foreach (var sectionDto in request.Sections)
                {
                    var newSection = new Section
                    {
                        CourseId = newCourse.CourseId,
                        Title = sectionDto.Title,
                        Objective = sectionDto.Objective,
                        OrderIndex = sectionDto.OrderIndex
                    };
                    _context.Sections.Add(newSection);
                    await _context.SaveChangesAsync();

                    foreach (var lessonDto in sectionDto.Lessons)
                    {
                        var newLesson = new Lesson
                        {
                            SectionId = newSection.SectionId,
                            Title = lessonDto.Title,
                            ContentType = lessonDto.ContentType,
                            VideoUrl = lessonDto.VideoUrl,
                            TextContent = lessonDto.TextContent,
                            DurationSeconds = lessonDto.DurationSeconds,
                            IsPreviewable = lessonDto.IsPreviewable,
                            OrderIndex = lessonDto.OrderIndex
                        };
                        _context.Lessons.Add(newLesson);
                        await _context.SaveChangesAsync();

                        if (lessonDto.Resources.Any())
                        {
                            _context.LessonResources.AddRange(lessonDto.Resources.Select(res => new LessonResource
                            {
                                LessonId = newLesson.LessonId,
                                ResourceName = res.Name,
                                ResourceUrl = res.Url
                            }));
                        }
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { Message = "Course created successfully", CourseId = newCourse.CourseId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.Message);
            }
        }

        private string GenerateSlug(string title)
        {
            var slug = title.ToLower().Replace(" ", "-").Replace(",", "").Replace(".", "");
            return $"{slug}-{Guid.NewGuid().ToString().Substring(0, 8)}";
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.Categories
                .Select(c => new
                {
                    catId = c.CategoryId,
                    name = c.Name,       
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}