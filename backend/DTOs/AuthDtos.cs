using System.ComponentModel.DataAnnotations;

namespace MotiveBackend.DTOs
{
	public class RegisterDto
	{
        [Required]
        public ulong RoleId { get; set; }

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

    // ----------------------------------------------------------------------------------------------------------------

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class ChangeEmailDto
    {
        public string NewEmail { get; set; }
    }

    public class UpdateProfileDetailsDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Headline { get; set; }
        public string? Biography { get; set; }
    }

    public class UpdateProfilePictureDto
    {
        public string ProfilePictureUrl { get; set; }
    }
    public class UpdateUserPhonesDto
    {
        public List<string> PhoneNumbers { get; set; } = new List<string>();
    }
}