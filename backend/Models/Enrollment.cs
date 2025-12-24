using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class Enrollment
{
    public ulong EnrollmentId { get; set; }

    public ulong UserId { get; set; }

    public ulong CourseId { get; set; }

    public DateTime? EnrolledAt { get; set; }

    public string? AccessType { get; set; }

    public DateTime? CompletionDate { get; set; }

    public virtual Certificate? Certificate { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual ICollection<LessonProgress> LessonProgresses { get; set; } = new List<LessonProgress>();

    public virtual Payment? Payment { get; set; }

    public virtual User User { get; set; } = null!;
}
