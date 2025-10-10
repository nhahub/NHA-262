using Cartify.Domain.Interfaces;
using Cartify.Domain.Models;
using Cartify.Services.Interfaces;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Services.Implementation
{
	public class RegisterService : IRegisterService
	{
		private IUserRepository _userRepository;
		public RegisterService(IUserRepository repository)
		{
			_userRepository = repository;
		}
		public async Task<string> HashingPassword(string pw) => await Task.FromResult(BCrypt.Net.BCrypt.HashPassword(pw));

		public async Task<string> Register(TblUser user, TblAddress address)
		{
			var check = await _userRepository.GetByEmail(user.Email);
			if (check != null)
			{
				return ResultService.Failure("Email already exists!");
			}
			var check2 = await _userRepository.GetByUsername(user.UserName);
			if (check2 != null)
			{
				return ResultService.Failure("Username already exists!");
			}
			user.PasswordHash= await HashingPassword(user.PasswordHash);
			user.TblAddresses.Add(address);

			await _userRepository.CreateAsync(user);
			await _userRepository.SaveChanges();
			return ResultService.Success();
		}
	}
}
