using Cartify.Domain.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Services.Interfaces.Authentication
{
	public interface IUserService
	{
		Task<TblUser?> GetByEmail(string email);
		Task<IdentityResult> CreateUserAsync(TblUser user,string password);
		Task<IdentityResult> AddRoleToUserAsync(TblUser user,string role);
		Task<IEnumerable<string>> GetRolesAsync(TblUser user);
		Task<bool> CheckPassword(TblUser user,string password);
		Task<TblUser?> GetByUsername(string username);
		Task UpdateAsync(TblUser user);
		Task<TblUser> GetUserByToken(string token);
		Task<IdentityResult> ChangePassword(TblUser user, string newPassword);
		Task<TblUser?> GetById(string Id);
	}
}
