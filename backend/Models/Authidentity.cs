using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class Authidentity
{
    public ulong AuthId { get; set; }

    public ulong UserId { get; set; }

    public string Provider { get; set; } = null!;

    public string ProviderKey { get; set; } = null!;

    public string? PasswordHash { get; set; }

    public DateTime? LastLogin { get; set; }

    public virtual User User { get; set; } = null!;
}
