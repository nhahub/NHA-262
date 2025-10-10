using Cartify.Domain.Models;
using Cartify.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

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
			return await _appDbContext.TblUsers.FirstOrDefaultAsync(e=> e.Email== email);
		}

		public async Task<TblUser> GetByUsername(string username)
		{
			return await _appDbContext.TblUsers.FirstOrDefaultAsync(e => e.UserName == username);
		}
	}
}
