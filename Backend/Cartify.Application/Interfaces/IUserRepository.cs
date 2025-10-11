using Cartify.Domain.Interfaces;
using Cartify.Domain.Models;

namespace Cartify.Application.Interfaces
{
	public interface IUserRepository :IRepository<TblUser>
	{
		Task<TblUser>GetByUsername(string username);
		Task<TblUser> GetByEmail(string email);


	}
}
