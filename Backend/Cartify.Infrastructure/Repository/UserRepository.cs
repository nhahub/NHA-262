using Cartify.Domain.Models;
using Cartify.Application.Interfaces;
using Cartify.Infrastructure.Persistence;

namespace Cartify.Infrastructure.Repositories
{
	public class UserRepository : Repository<TblUser>, IUserRepository
	{
		private AppDbContext _appDbContext;
		public UserRepository(AppDbContext dbContext):base(dbContext) {
			_appDbContext = dbContext;
		}

		public async Task<TblUser> GetByEmail(string email)
		{
			return await Search(e=> e.Email== email);
		}

		public async Task<TblUser> GetByUsername(string username)
		{
			return await Search(e => e.UserName == username);
		}
	}
}
