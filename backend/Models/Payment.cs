using System;
using System.Collections.Generic;

namespace MotiveBackend.Models;

public partial class Payment
{
    public ulong PaymentId { get; set; }

    public ulong EnrollmentId { get; set; }

    public decimal AmountPaid { get; set; }

    public string? CurrencyCode { get; set; }

    public string? PaymentMethod { get; set; }

    public string? TransactionReference { get; set; }

    public string? Status { get; set; }

    public DateTime? PaymentDate { get; set; }

    public virtual Enrollment Enrollment { get; set; } = null!;
}
