using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class CourseObjective
{
    public ulong ObjectiveId { get; set; }

    public ulong DescriptionId { get; set; }

    public string ObjectiveText { get; set; } = null!;

    public virtual CourseDescription Description { get; set; } = null!;
}
