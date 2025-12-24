using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class LoginEvent
{
    public ulong EventId { get; set; }

    public ulong? UserId { get; set; }

    public DateTime? AttemptTime { get; set; }

    public bool IsSuccessful { get; set; }

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public string? FailureReason { get; set; }

    public virtual User? User { get; set; }
}
