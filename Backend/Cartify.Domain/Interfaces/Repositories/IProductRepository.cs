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
        Task<TblProduct?> GetProductByIdAsync(int productId);
        Task<IEnumerable<TblProduct>> GetAllProductsAsync();
        Task<IEnumerable<TblProduct>> GetProductsByCategoryIdAsync(int categoryId);
        Task<IEnumerable<TblProduct>> GetProductsBySubCategoryIdAsync(int subCategoryId);
    }
}
