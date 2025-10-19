using Cartify.Application.Contracts;
using Cartify.Domain.Models;

namespace Cartify.Application.Services.Interfaces.Authentication
{
	public interface IRegisterService
	{
		Task<string> Register(dtoRegister register);

	}
}
