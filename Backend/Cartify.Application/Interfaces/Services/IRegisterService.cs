using Cartify.Application.Contracts;
using Cartify.Domain.Models;

namespace Cartify.Application.Interfaces.Service
{
	public interface IRegisterService
	{
		Task<string> Register(dtoRegister register);
		Task<string> HashingPassword(string password);

	}
}
