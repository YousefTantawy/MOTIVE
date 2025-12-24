using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class AuditLogDetail
{
    public ulong DetailId { get; set; }

    public ulong LogId { get; set; }

    public string FieldName { get; set; } = null!;

    public string? OldValue { get; set; }

    public string? NewValue { get; set; }

    public virtual AuditLog Log { get; set; } = null!;
}
