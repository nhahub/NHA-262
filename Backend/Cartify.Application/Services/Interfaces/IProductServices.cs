using Cartify.Application.Contracts;
using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Services.Interfaces
{
    public interface IProductServices
    {
        Task<IEnumerable<ProductDetailDto>> GetProductDetailsAsync(int productId);
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<IEnumerable<ProductDto>> GetProductsByCategoryIdAsync(int categoryId);
        Task<IEnumerable<ProductDto>> GetProductsBySubCategoryIdAsync(int subCategoryId);
    }
}
