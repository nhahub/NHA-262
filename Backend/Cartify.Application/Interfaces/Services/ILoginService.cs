using Cartify.Application.Contracts;

namespace Cartify.Application.Interfaces.Service
{
	public interface ILoginService
	{
		Task<bool> Login(dtoLogin login);
		Task<bool> CheckPassword(string _password ,string _storedPassword);


	}
}
