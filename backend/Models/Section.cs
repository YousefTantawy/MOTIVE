using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class Section
{
    public ulong SectionId { get; set; }

    public ulong CourseId { get; set; }

    public string Title { get; set; } = null!;

    public int OrderIndex { get; set; }

    public string? Objective { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}
