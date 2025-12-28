namespace MotiveBackend.DTOs
{
    public class MarkLessonCompleteDto
    {
        public ulong UserId { get; set; }
        public ulong CourseId { get; set; }
        public ulong LessonId { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class UpdateWatchTimeDto
    {
        public ulong UserId { get; set; }
        public ulong CourseId { get; set; }
        public ulong LessonId { get; set; }
        public int Seconds { get; set; }
    }

    public class SubmitReviewDto
    {
        public ulong UserId { get; set; }
        public ulong CourseId { get; set; }
        public byte Rating { get; set; }
        public string Comment { get; set; }
    }
}