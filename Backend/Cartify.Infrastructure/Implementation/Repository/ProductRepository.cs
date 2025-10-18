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
            .ToListAsync();
        }

        public async Task<TblProduct?> GetProductDetailsAsync(int id)
        {
            return await _context.TblProducts
          .Include(p => p.Type)
              .ThenInclude(t => t.Category)
          .Include(p => p.TblProductImages)
          .Include(p => p.ProductDetails)
              .ThenInclude(d => d.AttributeProduct)
                  .ThenInclude(a => a.Attripute)
                      .ThenInclude(u => u.LkpUnitMeasuresAttributes)
          .AsNoTracking()
          .FirstOrDefaultAsync(p => p.ProductId == id);

        }
    }
}
