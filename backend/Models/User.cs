using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class User
{
    public ulong UserId { get; set; }

    public ulong RoleId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? ProfilePictureUrl { get; set; }

    public string? Headline { get; set; }

    public string? Biography { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

    public virtual ICollection<Authidentity> Authidentities { get; set; } = new List<Authidentity>();

    public virtual ICollection<CourseInstructor> CourseInstructors { get; set; } = new List<CourseInstructor>();

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public virtual ICollection<LoginEvent> LoginEvents { get; set; } = new List<LoginEvent>();

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<UserLink> UserLinks { get; set; } = new List<UserLink>();

    public virtual ICollection<UserPhone> UserPhones { get; set; } = new List<UserPhone>();

    public virtual ICollection<UserReview> UserReviews { get; set; } = new List<UserReview>();
}
