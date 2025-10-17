using System.ComponentModel.DataAnnotations;

namespace Cartify.API.Contracts
{
	public class LoginForm
	{
		public string username { get; set; }
		[DataType(DataType.Password)]
		public string password { get; set; }
	}
}
