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
    public class ProductServices : IProductServices
    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductServices(IUnitOfWork UnitOfWork)
        {
            this._unitOfWork = UnitOfWork;  
        }

        public async Task<IEnumerable<TblProduct>> GetAllProductsAsync()
        {
            return await _unitOfWork.ProductRepository.GetAllProductsAsync();
        }

        public async Task<TblProduct?> GetProductDetailsAsync(int id)
        {
            return await _unitOfWork.ProductRepository.GetProductDetailsAsync(id);
        }
    }
}
