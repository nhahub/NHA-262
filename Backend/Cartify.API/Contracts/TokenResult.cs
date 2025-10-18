namespace Cartify.API.Contracts
{
	public class TokenResult
	{
		public string Jwt { get; set; }
		public DateTime JwtExpiry { get; set; }

	}
}
