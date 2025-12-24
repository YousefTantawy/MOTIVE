using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class UserPhone
{
    public ulong PhoneId { get; set; }

    public ulong UserId { get; set; }

    public string PhoneNumber { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
