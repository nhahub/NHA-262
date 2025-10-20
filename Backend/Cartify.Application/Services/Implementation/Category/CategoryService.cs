using Cartify.Application.Services.Interfaces;
using Cartify.Domain.Interfaces.Repositories;
using Cartify.Domain.Models;

namespace Cartify.Application.Services.Implementation.Category
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
