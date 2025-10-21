using Cartify.Application.Services.Interfaces;
using Cartify.Domain.Interfaces.Repositories;
using Cartify.Domain.Models;

namespace Cartify.Application.Services.Implementation.Category
{
    public class SubCategoryService : ISubCategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        public SubCategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<TblType>> GetAllSubCategories()
        {
            return await _unitOfWork.SubCategoryRepository.GetAllSubCategories();
        }

    }
}
