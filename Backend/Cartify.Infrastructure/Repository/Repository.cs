using Cartify.Domain.Interfaces;
using Cartify.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Infrastructure.Repositories
{
	public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
	{
		private AppDbContext _appDbContext;
		private DbSet<TEntity> _entity;

		public Repository(AppDbContext appDbContext)
		{
			_appDbContext = appDbContext;
			_entity = _appDbContext.Set<TEntity>();
		}
		public async ValueTask<TEntity> CreateAsync(TEntity entity)
		{
			await _entity.AddAsync(entity);
			return entity;
		}
		public async ValueTask<IEnumerable<TEntity>> ReadAsync() => await _entity.ToListAsync();
		public async ValueTask<TEntity> ReadByIdAsync(int id) => await _entity.FindAsync(id);
		public void Update(TEntity entity) => _entity.Update(entity);
		public async ValueTask DeleteAsync(int Id)
		{
			var entity=await _entity.FindAsync(Id);
			_entity.Remove(entity);
		}
		public async Task<int> SaveChanges() => await _appDbContext.SaveChangesAsync();
	}
}
