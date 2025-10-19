using Cartify.Application.Contracts;

namespace Cartify.Application.Services.Interfaces.Authentication
{
	public interface ILoginService
	{
		Task<dtoTokenResult> Login(dtoLogin login);
		Task<dtoTokenResult> RefreshToken(string  token);

	}
}
