using System.Linq.Expressions;

namespace Cartify.Domain.Interfaces
{
	public interface IRepository<T> where T : class
	{
		ValueTask<T> CreateAsync(T entity);
		ValueTask<IEnumerable<T>> ReadAsync();
		ValueTask<T> ReadByIdAsync(int id);
		void Update(T entity);
		ValueTask DeleteAsync(int Id);
		ValueTask<T> Search(Expression<Func<T,bool>> predicate);
		Task<int> SaveChanges();

	}
}
