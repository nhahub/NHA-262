using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Domain.Interfaces.Repositories
{
    public interface ISubCategoryRepository : IRepository<TblType>
    {
        Task<IEnumerable<TblType>> GetAllSubCategories();
        Task<IEnumerable<TblType>> GetSubCategoriesByCategoryIdAsync(int categoryId);
    }
}
