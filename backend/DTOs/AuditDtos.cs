using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MotiveBackend.DTOs
{
    public class AuditLog
    {
        [Key]
        public int LogId { get; set; }

        public int? UserId { get; set; } // Nullable if system action or not logged in

        [Required]
        [MaxLength(50)]
        public string ActionType { get; set; } = string.Empty; // "CREATE", "UPDATE", "DELETE"

        [Required]
        [MaxLength(100)]
        public string EntityAffected { get; set; } = string.Empty; // "Course", "User"

        public int? EntityId { get; set; }

        [MaxLength(45)]
        public string IpAddress { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Navigation Property for the details table
        public ICollection<AuditLogDetail> Details { get; set; } = new List<AuditLogDetail>();
    }

    public class AuditLogDetail
    {
        [Key]
        public int DetailId { get; set; }

        public int LogId { get; set; }

        [ForeignKey("LogId")]
        public AuditLog Log { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string FieldName { get; set; } = string.Empty; // e.g., "Price"

        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
    }
}