using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class Course
{
    public ulong CourseId { get; set; }

    public string Title { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public decimal Price { get; set; }

    public string? ThumbnailUrl { get; set; }

    public string? Language { get; set; }

    public string? DifficultyLevel { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<CourseCategory> CourseCategories { get; set; } = new List<CourseCategory>();

    public virtual CourseDescription? CourseDescription { get; set; }

    public virtual ICollection<CourseInstructor> CourseInstructors { get; set; } = new List<CourseInstructor>();

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public virtual ICollection<Section> Sections { get; set; } = new List<Section>();

    public virtual ICollection<UserReview> UserReviews { get; set; } = new List<UserReview>();
}
