using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class LessonProgress
{
    public ulong ProgressId { get; set; }

    public ulong EnrollmentId { get; set; }

    public ulong LessonId { get; set; }

    public bool? IsCompleted { get; set; }

    public int? LastWatchedSecond { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Enrollment Enrollment { get; set; } = null!;

    public virtual Lesson Lesson { get; set; } = null!;
}
