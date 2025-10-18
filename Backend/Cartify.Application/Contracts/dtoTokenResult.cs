using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Contracts
{
	public class dtoTokenResult
	{
		public string Jwt { get; set; }
		public DateTime JwtExpiry { get; set; }
		public string RefreshToken { get; set; }
		public DateTime RefreshTokenExpiry { get; set; }


		public DateTime RefreshTokenCreation { get; set; }
		public bool Success { get; set; } = true;
		public string ErrorMessage { get; set; } = string.Empty;

		public static implicit operator string(dtoTokenResult v)
		{
			throw new NotImplementedException();
		}
	}
}
