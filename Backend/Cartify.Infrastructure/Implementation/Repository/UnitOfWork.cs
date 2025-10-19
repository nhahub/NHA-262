using Cartify.Domain.Interfaces.Repositories;
using Cartify.Infrastructure.Persistence;

namespace Cartify.Infrastructure.Implementation.Services
{
    public class UnitOfWork : IUnitOfWork
	{

		private readonly AppDbContext _context;
		public ICategoryRepository CategoryRepository { get; }
		public ISubCategoryRepository SubCategoryRepository { get; }

        public IProductRepository ProductRepository {  get; }


        public UnitOfWork(AppDbContext context, ISubCategoryRepository SubCategoryRepository, ICategoryRepository CategoryRepository, IProductRepository ProductRepository)
		{
			_context = context;
			this.CategoryRepository = CategoryRepository;
			this.SubCategoryRepository = SubCategoryRepository;
			this.ProductRepository = ProductRepository;
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
