using Cartify.Domain.Models;

namespace Cartify.Domain.Interfaces.Repositories;
public interface IUnitOfWork : IDisposable
{
	public ICategoryRepository CategoryRepository { get; }
	public ISubCategoryRepository SubCategoryRepository { get; }
	public IRepository<PasswordResetCode> PasswordResetCodess { get; }


	public IProductRepository ProductRepository { get; }





    Task<int> SaveChanges();

}
