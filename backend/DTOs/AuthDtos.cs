using System.ComponentModel.DataAnnotations;

namespace MotiveBackend.Models.DTOs
{
	public class RegisterDto
	{
		[Required]
		public string FirstName { get; set; }

		[Required]
		public string LastName { get; set; }

		[Required]
		[EmailAddress]
		public string Email { get; set; }

		[Required]
		[MinLength(6)]
		public string Password { get; set; }
	}

	public class LoginDto
	{
		[Required]
		public string Email { get; set; }

		[Required]
		public string Password { get; set; }
	}
}