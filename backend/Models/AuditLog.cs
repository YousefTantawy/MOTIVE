using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class AuditLog
{
    public ulong LogId { get; set; }

    public ulong? UserId { get; set; }

    public string ActionType { get; set; } = null!;

    public string EntityAffected { get; set; } = null!;

    public string EntityId { get; set; } = null!;

    public string? IpAddress { get; set; }

    public DateTime? Timestamp { get; set; }

    public virtual ICollection<AuditLogDetail> AuditLogDetails { get; set; } = new List<AuditLogDetail>();

    public virtual User? User { get; set; }
}
