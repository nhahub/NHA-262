using Cartify.Application.Contracts;
using Cartify.Application.Interfaces;
using Cartify.Application.Interfaces.Repository;
using Cartify.Application.Interfaces.Service;

namespace Cartify.Application.Implementation
{
	public class LoginService : ILoginService
	{
		private readonly IUnitOfWork _unitOfWork;
		public LoginService(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
		}


		public async Task<bool> Login(dtoLogin dto)
		{
			var username = await _unitOfWork.Users.GetByUsername(dto.username);
			if (username == null)
			{
				return false;
			}
			return await CheckPassword(dto.password, username.PasswordHash);
		}

		public Task<bool> CheckPassword(string password, string storedPassword) => Task.FromResult(BCrypt.Net.BCrypt.Verify(password, storedPassword));



	}
}
