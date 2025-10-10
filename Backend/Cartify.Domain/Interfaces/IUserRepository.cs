using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Domain.Interfaces
{
	public interface IUserRepository :IRepository<TblUser>
	{
		Task<TblUser>GetByUsername(string username);
		Task<TblUser> GetByEmail(string email);


	}
}
