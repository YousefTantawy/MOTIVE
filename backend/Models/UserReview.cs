using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class UserReview
{
    public ulong ReviewId { get; set; }

    public ulong UserId { get; set; }

    public ulong CourseId { get; set; }

    public byte RatingValue { get; set; }

    public string? Comment { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
