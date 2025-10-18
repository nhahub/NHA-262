using Cartify.Application.Interfaces;
using Cartify.Application.Interfaces.Services;
using Cartify.Domain.Interfaces.Repositories;
using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Implementation
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;   
        }
        public async Task<IEnumerable<TblCategory>> GetAllCategories()
        {
            return await _unitOfWork.CategoryRepository.GetAllCategories();
        }
    }
}
