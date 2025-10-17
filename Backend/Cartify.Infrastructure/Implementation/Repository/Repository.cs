using Cartify.Domain.Interfaces.Repositories;
using Cartify.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Cartify.Infrastructure.Implementation.Repository
{
	public class Repository<T> : IRepository<T> where T : class
	{
		private AppDbContext _appDbContext;
		private DbSet<T> _entity;

		public Repository(AppDbContext appDbContext)
		{
			_appDbContext = appDbContext;
			_entity = _appDbContext.Set<T>();
		}
		public async ValueTask<T> CreateAsync(T entity)
		{
			await _entity.AddAsync(entity);
			return entity;
		}
		public async ValueTask<IEnumerable<T>> ReadAsync() => await _entity.AsNoTracking().ToListAsync();
		public async ValueTask<T> ReadByIdAsync(int id) => await _entity.FindAsync(id);
		public void Update(T entity) => _entity.Update(entity);
		public async ValueTask DeleteAsync(int Id)
		{
			var entity = await _entity.FindAsync(Id);
			_entity.Remove(entity);
		}

		public async ValueTask<T> Search(Expression<Func<T, bool>> predicate) => await _entity.FirstOrDefaultAsync(predicate);

		public async Task<IEnumerable<T>> GetAllIncluding(params Expression<Func<T, object>>[] includes)
		{
			IQueryable<T> query = _entity.AsQueryable();
			foreach (var include in includes)
			{
				query = query.Include(include);
			}
			return await query.AsNoTracking().ToListAsync();
		}
		public async Task<IEnumerable<TResult>> GetWithSelect<TResult>(Expression<Func<T, TResult>> selector,params Expression<Func<T, object>>[] includes)
		{
			IQueryable<T> query = _entity.AsQueryable();

			foreach (var include in includes)
			{
				query = query.Include(include);
			}

			return await query
				.Select(selector)
				.ToListAsync();
		}

		public async Task<IEnumerable<T>> Pagination(int page=1, int pageSize=10)
		{
			IEnumerable<T> list=await _entity.AsNoTracking().ToListAsync();
			int _totalSize=list.Count();
			int _totalPages= (int)Math.Ceiling((double) _totalSize/pageSize);
			list=list.Skip((page-1)*pageSize).Take(pageSize).ToList();
			return list;

		}
	}
}
