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
    public class SubCategoryRepository : Repository<TblType>, ISubCategoryRepository
    {
        private readonly AppDbContext _context;
        public SubCategoryRepository(AppDbContext context):base(context) => _context = context;
        public async Task<IEnumerable<TblType>> GetAllSubCategories()
        {
            return await _context.TblTypes.AsNoTracking().ToListAsync();
        }
    }
}
