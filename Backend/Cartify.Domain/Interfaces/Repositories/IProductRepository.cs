using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Domain.Interfaces.Repositories
{
    public interface IProductRepository : IRepository<TblProduct>
    {
        Task<IEnumerable<TblProduct>> GetAllProductsAsync();
        Task<TblProduct?> GetProductDetailsAsync(int id);
        Task<IEnumerable<TblProduct>> GetProductsBySubCategoryIdAsync(int subCategoryId);
        Task<IEnumerable<TblProduct>> GetProductsByCategoryIdAsync(int categoryId);
    }
}
