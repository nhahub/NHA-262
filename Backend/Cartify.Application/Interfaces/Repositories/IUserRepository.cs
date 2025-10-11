using Cartify.Domain.Models;

namespace Cartify.Application.Interfaces.Repository
{
	public interface IUserRepository :IRepository<TblUser>
	{
		Task<TblUser>GetByUsername(string username);
		Task<TblUser> GetByEmail(string email);


	}
}
