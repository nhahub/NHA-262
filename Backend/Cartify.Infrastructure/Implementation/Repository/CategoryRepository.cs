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
    public class CategoryRepository : Repository<TblCategory>, ICategoryRepository
    {
        private AppDbContext _context;

        public CategoryRepository(AppDbContext context):base(context) => _context = context;
        public async Task<IEnumerable<TblCategory>> GetAllCategories() => await _context.TblCategories.AsNoTracking().ToListAsync();
    }
}
