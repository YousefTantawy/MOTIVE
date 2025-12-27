namespace MotiveBackend.DTOs
{
    public class PaymentProcessDto
    {
        public ulong UserId { get; set; }
        public ulong CourseId { get; set; }
        public string PaymentMethod { get; set; }
    }
}