using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Domain.Interfaces.Repositories
{
    public interface IProfileRepository : IRepository<TblUser>
    {
        Task<TblUser> GetUser(int id);
    }
}
