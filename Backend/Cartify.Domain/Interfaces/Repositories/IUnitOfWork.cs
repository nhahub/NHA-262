namespace Cartify.Domain.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
	Task<int> SaveChanges();

}
