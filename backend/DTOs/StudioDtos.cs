using System.ComponentModel.DataAnnotations;

namespace MotiveBackend.DTOs
{
    // Level 1: The Main Payload
    public class CreateCourseDto
    {
        [Required] public ulong InstructorId { get; set; } // The user creating it
        [Required] public string Title { get; set; }
        [Required] public decimal Price { get; set; }
        public string ThumbnailUrl { get; set; }
        public string DifficultyLevel { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced
        public string Language { get; set; } = "English";

        // Categories (List of IDs)
        public List<ulong> CategoryIds { get; set; } = new();

        // Level 2: Description & Metadata
        public string FullDescription { get; set; }
        public List<string> Objectives { get; set; } = new();
        public List<string> Requirements { get; set; } = new();
        public List<string> TargetAudiences { get; set; } = new();

        // Level 3: Curriculum
        public List<SectionDto> Sections { get; set; } = new();
    }

    public class SectionDto
    {
        public string Title { get; set; }
        public string Objective { get; set; }
        public int OrderIndex { get; set; }
        public List<LessonDto> Lessons { get; set; } = new();
    }

    public class LessonDto
    {
        public string Title { get; set; }
        public string ContentType { get; set; } = "Video"; // Video, Article, Quiz
        public string VideoUrl { get; set; }
        public string TextContent { get; set; }
        public int DurationSeconds { get; set; }
        public bool IsPreviewable { get; set; }
        public int OrderIndex { get; set; }
        public List<ResourceDto> Resources { get; set; } = new();
    }

    public class ResourceDto
    {
        public string Name { get; set; }
        public string Url { get; set; }
    }
}