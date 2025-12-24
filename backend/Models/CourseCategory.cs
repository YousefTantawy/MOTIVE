using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class CourseCategory
{
    public ulong ClassificationId { get; set; }

    public ulong CourseId { get; set; }

    public ulong CategoryId { get; set; }

    public DateTime? AssignedAt { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual Course Course { get; set; } = null!;
}
