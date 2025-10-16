using Cartify.Application.Contracts;
using Cartify.Application.Interfaces;
using Cartify.Application.Interfaces.Repository;
using Cartify.Application.Interfaces.Service;
using Cartify.Application.Interfaces.Services;
using Cartify.Domain.Models;

namespace Cartify.Application.Implementation
{
	public class LoginService : ILoginService
	{
		private readonly IUserService _userService;
		private readonly ICreateJWTToken _createJWTToken;

		public LoginService(IUserService userService, ICreateJWTToken createJWTToken)
		{
			_userService = userService;
			_createJWTToken = createJWTToken;
		}


		public async Task<string> Login(dtoLogin dto)
		{
			TblUser? user = null;
			if (dto.Email.Contains("@"))
			{
				user = await _userService.GetByEmail(dto.Email);

			}
			else
			{
				user = await _userService.GetByUsername(dto.Email);

			}
			if (user == null)
			{
				return "Username or password is wrong!";
			}
			bool check = await _userService.CheckPassword(user, dto.password);
			if (!check)
			{
				return "Username or password is wrong!";
			}
			var Roles = await _userService.GetRolesAsync(user);
			return _createJWTToken.CreateToken(user, Roles.FirstOrDefault());
		}




	}
}
