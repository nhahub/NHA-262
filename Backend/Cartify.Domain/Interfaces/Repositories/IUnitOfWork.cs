using Cartify.Domain.Entities;
using Cartify.Domain.Models;

namespace Cartify.Domain.Interfaces.Repositories;
public interface IUnitOfWork : IDisposable
{
	public ICategoryRepository CategoryRepository { get; }
	public ISubCategoryRepository SubCategoryRepository { get; }
	public IRepository<PasswordResetCodes> PasswordResetCodess { get; }
	public IRepository<TblUserStore> UserStorerepository { get; }


	public IProductRepository ProductRepository { get; }





    Task<int> SaveChanges();

}
