using Cartify.Domain.Interfaces.Repositories;
using Cartify.Domain.Models;
using Cartify.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Infrastructure.Implementation.Repository
{
    public class ProfileRepository : Repository<TblUser>, IProfileRepository
    {
        private readonly AppDbContext _Context;

        public ProfileRepository(AppDbContext Context):base(Context)
        {
            this._Context = Context;
        }


        public Task<TblUser> GetUser(int id)
        {
            throw new NotImplementedException();
        }
    }
}
