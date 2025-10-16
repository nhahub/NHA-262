using Cartify.Application.Contracts;

namespace Cartify.Application.Interfaces.Service
{
	public interface ILoginService
	{
		Task<string> Login(dtoLogin login);


	}
}
