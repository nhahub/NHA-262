using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Contracts
{
	public class dtoRegister
	{
		public string Email { get; set; }
		public string Password { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string UserName { get; set; }
		public DateOnly BirthDate { get; set; }
		public string Telephone { get; set; }
		public string Gender { get; set; }
		public string? StreetAddress { get; set; }
		public string? City { get; set; }
		public string? State { get; set; }
		public string? ZipCode { get; set; }
		public string? Country { get; set; }
	}
}
