using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class UserLink
{
    public ulong LinkId { get; set; }

    public ulong UserId { get; set; }

    public string PlatformName { get; set; } = null!;

    public string Url { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
