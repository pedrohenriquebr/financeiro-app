using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using FinanceiroApp.Core.Data;
using FinanceiroApp.Core.Services;

namespace FinanceiroApp.Core.Services
{
    public class SQLiteDataStore<T> : IDataStore<T> where T : class
    {
        private readonly FinanceiroDbContext _context;
        private readonly DbSet<T> _dbSet;

        public SQLiteDataStore(FinanceiroDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public IEnumerable<T> GetAll()
        {
            return _dbSet.AsNoTracking().ToList();
        }

        public T GetById(int id)
        {
            var entity = _dbSet.Find(id);
            if (entity != null)
            {
                _context.Entry(entity).State = EntityState.Detached;
            }
            return entity;
        }

        public void Add(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            try
            {
                _dbSet.Add(entity);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to add entity: {ex.Message}", ex);
            }
        }

        public void Update(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            try
            {
                _dbSet.Update(entity);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to update entity: {ex.Message}", ex);
            }
        }

        public void Delete(int id)
        {
            var entity = _dbSet.Find(id);
            if (entity != null)
            {
                try
                {
                    _dbSet.Remove(entity);
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    throw new Exception($"Failed to delete entity: {ex.Message}", ex);
                }
            }
        }

        public void SaveChanges()
        {
            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to save changes: {ex.Message}", ex);
            }
        }
    }
}
