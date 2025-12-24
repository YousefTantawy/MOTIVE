using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class Certificate
{
    public ulong CertificateId { get; set; }

    public ulong EnrollmentId { get; set; }

    public string UniqueCode { get; set; } = null!;

    public DateTime? IssueDate { get; set; }

    public string? PdfUrl { get; set; }

    public virtual Enrollment Enrollment { get; set; } = null!;
}
