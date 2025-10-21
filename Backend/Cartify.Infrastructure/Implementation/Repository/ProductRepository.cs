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
          .Include(p => p.Type)
              .ThenInclude(t => t.Category)
          .Include(p => p.TblProductImages)
          .Include(p => p.TblProductsDetail)
              .ThenInclude(d => d.ProductDetail)
              .ThenInclude(p=>p.LkpAttributesProducts)
                  .ThenInclude(a => a.Attripute)
                      .ThenInclude(u => u.LkpUnitMeasuresAttributes)
                      .ThenInclude(u=>u.UnitOfMeasure)
          .AsNoTracking()
          .FirstOrDefaultAsync(p => p.ProductId == id);

        }

        public async Task<IEnumerable<TblProduct>> GetProductsByCategoryIdAsync(int categoryId)
        {
            return await _context.TblProducts
                .Include(p => p.Type)
                .Include(p => p.TblProductImages)
                .Include(p => p.TblProductsDetail)
                .ThenInclude(d => d.Price)
                .Where(p => p.Type.CategoryId == categoryId)
                .AsNoTracking()
                .ToHashSetAsync();
        }


        public async Task<IEnumerable<TblProduct>> GetProductsBySubCategoryIdAsync(int subCategoryId)
        {
            return await _context.TblProducts
               .Include(p => p.TypeId == subCategoryId)
               .Include(p => p.TblProductImages)
               .Include(p => p.TblProductsDetail)
               .ThenInclude(d => d.Price)
               .AsNoTracking()
               .ToHashSetAsync();
        }
    }
}
