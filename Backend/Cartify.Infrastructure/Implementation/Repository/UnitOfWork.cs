using Cartify.Domain.Interfaces.Repositories;
using Cartify.Infrastructure.Persistence;

namespace Cartify.Infrastructure.Implementation.Services
{
	public class UnitOfWork : IUnitOfWork
	{

		private readonly AppDbContext _context;
		public ICategoryRepository CategoryRepository { get; }
		public ISubCategoryRepository SubCategoryRepository { get; }
        public UnitOfWork(AppDbContext context, ISubCategoryRepository SubCategoryRepository, ICategoryRepository CategoryRepository)
		{
			_context = context;
			this.CategoryRepository = CategoryRepository;
			this.SubCategoryRepository = SubCategoryRepository;
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
