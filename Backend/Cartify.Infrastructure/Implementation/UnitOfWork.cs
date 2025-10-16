using Cartify.Application.Interfaces;
using Cartify.Application.Interfaces.Repository;
using Cartify.Infrastructure.Implementation.Repository;
using Cartify.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Infrastructure.Implementation
{
	public class UnitOfWork : IUnitOfWork
	{
		private readonly AppDbContext _context;
		public UnitOfWork(AppDbContext context)
		{
			_context = context;
		}

		public void Dispose()
		{
			_context.Dispose();
		}

		public async Task<int> SaveChanges()
		{
			return await _context.SaveChangesAsync();
			
		}
	}
}
