using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class ViewMostEnrolled
{
    public ulong CourseId { get; set; }

    public string Title { get; set; } = null!;

    public decimal Price { get; set; }

    public DateTime? CreatedAt { get; set; }
}
