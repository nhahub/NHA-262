using Cartify.Domain.Interfaces;
using Cartify.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Cartify.Infrastructure.Repositories
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
		public async ValueTask<IEnumerable<T>> ReadAsync() => await _entity.ToListAsync();
		public async ValueTask<T> ReadByIdAsync(int id) => await _entity.FindAsync(id);
		public void Update(T entity) => _entity.Update(entity);
		public async ValueTask DeleteAsync(int Id)
		{
			var entity=await _entity.FindAsync(Id);
			 _entity.Remove(entity);
		}
		public async Task<int> SaveChanges() => await _appDbContext.SaveChangesAsync();

		public async ValueTask<T> Search(Expression<Func<T, bool>> predicate) => await _entity.FirstOrDefaultAsync(predicate);
	}
}
