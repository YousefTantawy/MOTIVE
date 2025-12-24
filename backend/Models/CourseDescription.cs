using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class CourseDescription
{
    public ulong DescriptionId { get; set; }

    public ulong CourseId { get; set; }

    public string? FullText { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual ICollection<CourseObjective> CourseObjectives { get; set; } = new List<CourseObjective>();

    public virtual ICollection<CourseRequirement> CourseRequirements { get; set; } = new List<CourseRequirement>();

    public virtual ICollection<CourseTargetAudience> CourseTargetAudiences { get; set; } = new List<CourseTargetAudience>();
}
