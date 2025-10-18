using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Domain.Interfaces.Repositories
{
    public interface ICategoryRepository : IRepository<TblCategory>
    {
        Task<IEnumerable<TblCategory>> GetAllCategories();
    }
}
