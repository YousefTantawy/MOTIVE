namespace MotiveBackend.DTOs
{
    public class ProcessPaymentDto
    {
        public ulong UserId { get; set; }
        public ulong CourseId { get; set; }
        public string PaymentMethod { get; set; } // e.g., "Visa", "PayPal"
    }
}