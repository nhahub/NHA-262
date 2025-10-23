using Cartify.Domain.Entities;
using Cartify.Domain.Interfaces.Repositories;
using Cartify.Domain.Models;
using Cartify.Infrastructure.Persistence;

namespace Cartify.Infrastructure.Implementation.Services
{
	public class UnitOfWork : IUnitOfWork
	{

		private readonly AppDbContext _context;
		public ICategoryRepository CategoryRepository { get; }
		public ISubCategoryRepository SubCategoryRepository { get; }
		public IProductRepository ProductRepository { get; }
		public IRepository<PasswordResetCode> PasswordResetCodess { get; }
        public IProfileRepository ProfileRepository { get; }
        public IRepository<TblUserStore> UserStorerepository { get; }
		public UnitOfWork(AppDbContext context, ISubCategoryRepository SubCategoryRepository, ICategoryRepository CategoryRepository, IProductRepository ProductRepository, IRepository<PasswordResetCode> passwordResetCodess, IProfileRepository ProfileRepository)
		{
			_context = context;
			this.CategoryRepository = CategoryRepository;
			this.SubCategoryRepository = SubCategoryRepository;
			this.ProductRepository = ProductRepository;
			this.PasswordResetCodess = passwordResetCodess;
			this.ProfileRepository = ProfileRepository;
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
