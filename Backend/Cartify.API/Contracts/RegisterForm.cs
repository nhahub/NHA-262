using System.ComponentModel.DataAnnotations;

namespace Cartify.API.Contracts
{
	public class RegisterForm
	{
		[Required]
		[DataType(DataType.EmailAddress)]
		public string Email { get; set; }
		[Required]

		[DataType(DataType.Password)]

		public string Password { get; set; }
		[Required]

		public string FirstName { get; set; }
		[Required]

		public string LastName { get; set; }
		[Required]

		public string UserName { get; set; }


		[DataType(DataType.Date)]
		[Required]

		public DateOnly BirthDate { get; set; }
		[Required]

		[DataType(DataType.PhoneNumber)]

		public string Telephone { get; set; }
		[Required]

		public string Gender { get; set; }

		public string? StreetAddress { get; set; }
		public string? City { get; set; }
		public string? State { get; set; }
		[DataType(DataType.PostalCode)]
		public string? ZipCode { get; set; }
		public string? Country { get; set; }


	}
}
