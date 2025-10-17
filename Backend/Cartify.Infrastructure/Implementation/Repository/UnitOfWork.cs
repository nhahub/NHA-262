using Cartify.Domain.Interfaces.Repositories;
using Cartify.Infrastructure.Persistence;

namespace Cartify.Infrastructure.Implementation.Services
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
