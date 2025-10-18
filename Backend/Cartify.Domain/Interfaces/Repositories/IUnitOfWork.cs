namespace Cartify.Domain.Interfaces.Repositories;
public interface IUnitOfWork : IDisposable
{
	public ICategoryRepository CategoryRepository { get; }
	public ISubCategoryRepository SubCategoryRepository { get; }

	Task<int> SaveChanges();

}
