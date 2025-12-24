using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class RolePermission
{
    public ulong PermissionId { get; set; }

    public ulong RoleId { get; set; }

    public string PermissionSlug { get; set; } = null!;

    public virtual Role Role { get; set; } = null!;
}
