namespace Cartify.Core.Interfaces
{
	public interface IRepository<TEntity> where TEntity : class
	{
		ValueTask<TEntity> CreateAsync(TEntity entity);
		ValueTask<IEnumerable<TEntity>> ReadAsync();
		ValueTask<TEntity> ReadByIdAsync(int id);
		void Update(TEntity entity);
		ValueTask DeleteAsync(int Id);
		Task<int> SaveChanges();

	}
}
