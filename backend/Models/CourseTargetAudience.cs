using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class CourseTargetAudience
{
    public ulong AudienceId { get; set; }

    public ulong DescriptionId { get; set; }

    public string AudienceText { get; set; } = null!;

    public virtual CourseDescription Description { get; set; } = null!;
}
