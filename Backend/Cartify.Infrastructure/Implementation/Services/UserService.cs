using Cartify.Application.Services.Interfaces.Authentication;
using Cartify.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
namespace Cartify.Infrastructure.Implementation.Services
{
	public class UserService : IUserService
	{
		private readonly UserManager<TblUser> _userManager;

		public UserService(UserManager<TblUser> userManager)
		{
			_userManager = userManager;
		}
		public async Task<TblUser?> GetByEmail(string email)
		{
			return await _userManager.FindByEmailAsync(email);
		}
		public async Task<TblUser?> GetByUsername(string username)
		{
			return await _userManager.FindByNameAsync(username);
		}
		public async Task<IdentityResult> CreateUserAsync(TblUser user, string password)
		{
			return await _userManager.CreateAsync(user, password);
		}

		public Task<bool> CheckPassword(TblUser user, string password)
		{
			var check=_userManager.CheckPasswordAsync(user, password);
			return check;
		}

		public async Task<IdentityResult> AddRoleToUserAsync(TblUser user, string role)
		{
		return	await _userManager.AddToRoleAsync(user, role);
		}

		public async Task<IEnumerable<string>> GetRolesAsync(TblUser user)
		{
			return await _userManager.GetRolesAsync(user);
		}

		public async Task UpdateAsync(TblUser user)
		{
		await _userManager.UpdateAsync(user);
		}

		public async Task<TblUser> GetUserByToken(string token)
		{
			return await _userManager.Users
				.SingleOrDefaultAsync(x => x.RefreshTokens != null && x.RefreshTokens.Any(rt => rt.Token == token));
		}
		public async Task<IdentityResult> ChangePassword(TblUser user,string newPassword)
		{
			var token=await _userManager.GeneratePasswordResetTokenAsync(user);
			var result=await _userManager.ResetPasswordAsync(user,token, newPassword);
			return result;
		}
		public async Task<TblUser?> GetById(string Id)
		{
			return await _userManager.FindByIdAsync(Id);
		}
	}
}
