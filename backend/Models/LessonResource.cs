using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class LessonResource
{
    public ulong ResourceId { get; set; }

    public ulong LessonId { get; set; }

    public string ResourceName { get; set; } = null!;

    public string ResourceUrl { get; set; } = null!;

    public virtual Lesson Lesson { get; set; } = null!;
}
