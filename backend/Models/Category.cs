using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class Category
{
    public ulong CategoryId { get; set; }

    public ulong? ParentId { get; set; }

    public string Name { get; set; } = null!;

    public string? IconClass { get; set; }

    public virtual ICollection<CourseCategory> CourseCategories { get; set; } = new List<CourseCategory>();

    public virtual ICollection<Category> InverseParent { get; set; } = new List<Category>();

    public virtual Category? Parent { get; set; }
}
