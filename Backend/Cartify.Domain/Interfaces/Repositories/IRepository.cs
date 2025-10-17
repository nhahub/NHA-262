using System.Linq.Expressions;

namespace Cartify.Domain.Interfaces.Repositories
{
	public interface IRepository<T> where T : class
	{
		ValueTask<T> CreateAsync(T entity);
		ValueTask<IEnumerable<T>> ReadAsync();
		ValueTask<T> ReadByIdAsync(int id);
		void Update(T entity);
		ValueTask DeleteAsync(int Id);
		ValueTask<T> Search(Expression<Func<T,bool>> predicate);
		Task<IEnumerable<T>> GetAllIncluding(params Expression<Func<T, object>>[] includes);
		 Task<IEnumerable<TResult>> GetWithSelect<TResult>(Expression<Func<T, TResult>> selector,params Expression<Func<T, object>>[] includes); 
		Task <IEnumerable<T>> Pagination(int page,int pageSize);
	}
}
