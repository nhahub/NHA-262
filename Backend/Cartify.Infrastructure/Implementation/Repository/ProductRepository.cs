using Cartify.Domain.Interfaces.Repositories;
using Cartify.Domain.Models;
using Cartify.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Infrastructure.Implementation.Repository
{
    public class ProductRepository :Repository<TblProduct> , IProductRepository
    {
        private readonly AppDbContext _context;
        public ProductRepository(AppDbContext context):base(context) => _context = context;

        public async Task<IEnumerable<TblProduct>> GetAllProductsAsync()
        {
            return await _context.TblProducts
            .Include(p => p.Type)
            .Include(p => p.Type.Category)
            .Include(p => p.TblProductImages)
            .AsNoTracking()
            .ToHashSetAsync();
        }

        public async Task<TblProduct?> GetProductDetailsAsync(int id)
        {
            return await _context.TblProducts
                .AsNoTracking()
                .Include(p => p.TblProductDetails) 
                .FirstOrDefaultAsync(p => p.ProductId == id);
        }



        public async Task<IEnumerable<TblProduct>> GetProductsByCategoryIdAsync(int categoryId)
        {
            return await _context.TblProducts
                .Include(p => p.Type)
                .Include(p => p.TblProductImages)
                .Where(p => p.Type.CategoryId == categoryId)
                .AsNoTracking()
                .ToHashSetAsync();
        }


        public async Task<IEnumerable<TblProduct>> GetProductsBySubCategoryIdAsync(int subCategoryId)
        {
            return await _context.TblProducts
               .Include(p => p.TypeId == subCategoryId)
               .Include(p => p.TblProductImages)
               .AsNoTracking()
               .ToHashSetAsync();
        }
    }
}
