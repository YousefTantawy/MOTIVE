using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class CourseInstructor
{
    public ulong AssignmentId { get; set; }

    public ulong CourseId { get; set; }

    public ulong UserId { get; set; }

    public bool? IsPrimaryAuthor { get; set; }

    public decimal? RevenueShare { get; set; }

    public DateTime? AssignedAt { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
