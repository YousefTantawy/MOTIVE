using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class Lesson
{
    public ulong LessonId { get; set; }

    public ulong SectionId { get; set; }

    public string Title { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public string? VideoUrl { get; set; }

    public string? TextContent { get; set; }

    public int? DurationSeconds { get; set; }

    public bool? IsPreviewable { get; set; }

    public int OrderIndex { get; set; }

    public virtual ICollection<LessonProgress> LessonProgresses { get; set; } = new List<LessonProgress>();

    public virtual ICollection<LessonResource> LessonResources { get; set; } = new List<LessonResource>();

    public virtual Section Section { get; set; } = null!;
}
