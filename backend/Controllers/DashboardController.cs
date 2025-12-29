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

        [HttpGet("{courseId}/dashboard/{userId}")]
        public async Task<IActionResult> GetCourseDashboard(ulong courseId, ulong userId)
        {
            var enrollment = await _context.Enrollments
                .Include(e => e.Certificate)
                .FirstOrDefaultAsync(e => e.CourseId == courseId && e.UserId == userId);

            if (enrollment == null)
            {
                return Unauthorized("User is not enrolled in this course.");
            }

            var courseContent = await _context.Courses
                .Include(c => c.CourseInstructors)
                    .ThenInclude(ci => ci.User)
                .Include(c => c.Sections)
                    .ThenInclude(s => s.Lessons)
                        .ThenInclude(l => l.LessonResources)
                .Where(c => c.CourseId == courseId)
                .FirstOrDefaultAsync();

            if (courseContent == null) return NotFound("Course content not found.");

            var progressData = await _context.LessonProgresses
                .Where(lp => lp.EnrollmentId == enrollment.EnrollmentId)
                .ToDictionaryAsync(lp => lp.LessonId, lp => new
                {
                    lp.IsCompleted,
                    lp.LastWatchedSecond
                });

            int totalLessons = courseContent.Sections.SelectMany(s => s.Lessons).Count();
            int completedLessons = progressData.Count(p => p.Value.IsCompleted == true);
            double progressPercentage = totalLessons > 0 ? (double)completedLessons / totalLessons * 100 : 0;

            var dashboardData = new
            {
                courseId = courseContent.CourseId,
                courseTitle = courseContent.Title,
                instructor = courseContent.CourseInstructors
                    .Select(ci => $"{ci.User.FirstName} {ci.User.LastName}")
                    .FirstOrDefault() ?? "Unknown Instructor",

                overallProgress = Math.Round(progressPercentage, 2),
                certificateUrl = enrollment.Certificate?.PdfUrl,

                sections = courseContent.Sections
                    .OrderBy(s => s.OrderIndex)
                    .Select(s => new
                    {
                        sectionId = s.SectionId,
                        title = s.Title,
                        objective = s.Objective,
                        lessons = s.Lessons
                            .OrderBy(l => l.OrderIndex)
                            .Select(l => new
                            {
                                lessonId = l.LessonId,
                                title = l.Title,
                                type = l.ContentType,
                                videoUrl = string.IsNullOrEmpty(l.VideoUrl) ? "NO URL" : l.VideoUrl,
                                textContent = l.TextContent,
                                duration = l.DurationSeconds,
                                isPreviewable = l.IsPreviewable,

                                isCompleted = progressData.ContainsKey(l.LessonId) ? progressData[l.LessonId].IsCompleted : false,
                                lastWatchedSecond = progressData.ContainsKey(l.LessonId) ? progressData[l.LessonId].LastWatchedSecond : 0,

                                resources = l.LessonResources.Select(r => new
                                {
                                    name = r.ResourceName,
                                    url = r.ResourceUrl
                                })
                            })
                    })
            };

            return Ok(dashboardData);
        }

        [HttpPost("completeLessonCheck")]
        public async Task<IActionResult> MarkLessonCompleteOrNot([FromBody] MarkLessonCompleteDto request)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == request.UserId && e.CourseId == request.CourseId);

            if (enrollment == null)
            {
                return Unauthorized("User is not enrolled in this course.");
            }

            var progress = await _context.LessonProgresses
                .FirstOrDefaultAsync(p => p.EnrollmentId == enrollment.EnrollmentId && p.LessonId == request.LessonId);

            if (progress == null)
            {
                progress = new LessonProgress
                {
                    EnrollmentId = enrollment.EnrollmentId,
                    LessonId = request.LessonId,
                    IsCompleted = request.IsCompleted,
                    LastWatchedSecond = 0
                };
                _context.LessonProgresses.Add(progress);
            }
            else
            {
                progress.IsCompleted = request.IsCompleted;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Lesson completion status updated." });
        }

        [HttpPost("updateWatchTime")]
        public async Task<IActionResult> UpdateWatchTime([FromBody] UpdateWatchTimeDto request)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == request.UserId && e.CourseId == request.CourseId);

            if (enrollment == null)
            {
                return Unauthorized("User is not enrolled in this course.");
            }

            var progress = await _context.LessonProgresses
                .FirstOrDefaultAsync(p => p.EnrollmentId == enrollment.EnrollmentId && p.LessonId == request.LessonId);

            if (progress == null)
            {
                progress = new LessonProgress
                {
                    EnrollmentId = enrollment.EnrollmentId,
                    LessonId = request.LessonId,
                    IsCompleted = false,
                    LastWatchedSecond = request.Seconds
                };
                _context.LessonProgresses.Add(progress);
            }
            else
            {
                progress.LastWatchedSecond = request.Seconds;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Watch time updated." });
        }

        [HttpPost("review")]
        public async Task<IActionResult> SubmitReview([FromBody] SubmitReviewDto request)
        {
            var isEnrolled = await _context.Enrollments
                .AnyAsync(e => e.UserId == request.UserId && e.CourseId == request.CourseId);

            if (!isEnrolled)
            {
                return BadRequest("You must be enrolled in the course to leave a review.");
            }

            if (request.Rating < 1 || request.Rating > 5)
            {
                return BadRequest("Rating must be between 1 and 5.");
            }

            var existingReview = await _context.UserReviews
                .FirstOrDefaultAsync(r => r.UserId == request.UserId && r.CourseId == request.CourseId);

            if (existingReview != null)
            {
                existingReview.RatingValue = request.Rating;
                existingReview.Comment = request.Comment;
                existingReview.CreatedAt = DateTime.Now;
            }
            else
            {
                var newReview = new UserReview
                {
                    UserId = request.UserId,
                    CourseId = request.CourseId,
                    RatingValue = request.Rating,
                    Comment = request.Comment,
                    CreatedAt = DateTime.Now
                };
                _context.UserReviews.Add(newReview);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Review submitted successfully." });
        }

        [HttpGet("certificate/{enrollmentId}")]
        public async Task<IActionResult> GetCertificate(ulong enrollmentId)
        {
            var certificateData = await _context.Enrollments
                .Include(e => e.User)
                .Include(e => e.Course)
                .Include(e => e.Certificate)
                .Where(e => e.EnrollmentId == enrollmentId)
                .Select(e => new
                {
                    StudentName = $"{e.User.FirstName} {e.User.LastName}",
                    CourseName = e.Course.Title,
                    IssueDate = e.Certificate != null ? e.Certificate.IssueDate : DateTime.Now,
                    PdfUrl = e.Certificate != null ? e.Certificate.PdfUrl : "No URL generated",
                    UniqueCode = e.Certificate != null
                        ? $"MOT{e.Certificate.CertificateId}{e.CourseId}"
                        : "PENDING"
                })
                .FirstOrDefaultAsync();

            if (certificateData == null)
            {
                return NotFound("Enrollment or Certificate data not found.");
            }

            return Ok(certificateData);
        }
    }    
}
