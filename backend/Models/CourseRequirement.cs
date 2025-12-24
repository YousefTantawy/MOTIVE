using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class CourseRequirement
{
    public ulong RequirementId { get; set; }

    public ulong DescriptionId { get; set; }

    public string RequirementText { get; set; } = null!;

    public virtual CourseDescription Description { get; set; } = null!;
}
