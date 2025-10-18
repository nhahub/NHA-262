using Cartify.Application.Contracts;

namespace Cartify.Application.Interfaces.Service
{
	public interface ILoginService
	{
		Task<dtoTokenResult> Login(dtoLogin login);
		Task<dtoTokenResult> RefreshToken(string  token);

	}
}
