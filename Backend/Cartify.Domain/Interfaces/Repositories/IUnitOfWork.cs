namespace Cartify.Domain.Interfaces.Repositories;
public interface IUnitOfWork : IDisposable
{
	public ICategoryRepository CategoryRepository { get; }
	public ISubCategoryRepository SubCategoryRepository { get; }

    public IProductRepository ProductRepository { get; }





    Task<int> SaveChanges();

}
