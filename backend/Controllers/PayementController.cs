using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Data;
using MotiveBackend.DTOs;
using MotiveBackend.Models;

namespace MotiveBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly Ecen424DbProjectContext _context;

        public PaymentsController(Ecen424DbProjectContext context)
        {
            _context = context;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> ProcessCheckout([FromBody] PaymentProcessDto request)
        {
            var course = await _context.Courses.FindAsync(request.CourseId);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            var alreadyEnrolled = await _context.Enrollments
                .AnyAsync(e => e.UserId == request.UserId && e.CourseId == request.CourseId);

            if (alreadyEnrolled)
            {
                return BadRequest("User is already enrolled in this course.");
            }

            string accessType = course.Price == 0 ? "Free" : "Lifetime";
            var bankResult = SimulateBankTransaction();

            var newEnrollment = new Enrollment
            {
                UserId = request.UserId,
                CourseId = request.CourseId,
                AccessType = accessType,
                EnrolledAt = DateTime.Now,
                CompletionDate = null
            };

            _context.Enrollments.Add(newEnrollment);
            await _context.SaveChangesAsync();

            var newPayment = new Payment
            {
                EnrollmentId = newEnrollment.EnrollmentId,
                AmountPaid = course.Price,
                CurrencyCode = "USD",
                PaymentMethod = request.PaymentMethod,
                TransactionReference = bankResult.TransactionRef,
                Status = bankResult.Status,
                PaymentDate = DateTime.Now
            };

            _context.Payments.Add(newPayment);
            await _context.SaveChangesAsync();

            return Ok("success");
        }

        private (string TransactionRef, string Status) SimulateBankTransaction()
        {
            string transactionRef = "TXN-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
            string status = "Success";
            return (transactionRef, status);
        }
    }
}