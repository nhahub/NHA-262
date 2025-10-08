using Cartify.Core.Interfaces;
using Cartify.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Services
{
	public class LoginService : ILoginService
	{
		private IUserRepository _userRepository;
		public LoginService(IUserRepository repository)
		{
			_userRepository = repository;
		}


		public async Task<bool> Login(string user, string password)
		{
			var username = await _userRepository.GetByUsername(user);
			if (username == null)
			{
				return false;
			}
			return await CheckPassword(password, username.PasswordHash);
		}

		public Task<bool> CheckPassword(string password, string storedPassword) => Task.FromResult(BCrypt.Net.BCrypt.Verify(password, storedPassword));



	}
}
