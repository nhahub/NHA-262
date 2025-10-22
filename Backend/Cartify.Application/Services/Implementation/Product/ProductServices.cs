using Cartify.Application.Contracts;
using Cartify.Application.Services.Interfaces;
using Cartify.Domain.Interfaces.Repositories;
using Cartify.Domain.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cartify.Application.Services.Implementation
{
    public class ProductServices : IProductServices
    {
        private readonly IUnitOfWork _UnitOfWork;

        public ProductServices(IUnitOfWork UnitOfWork)
        {
            _UnitOfWork = UnitOfWork;
        }

        public async Task<IEnumerable<ProductDetailDto>> GetProductDetailsAsync(int productId)
        {
            var product = await _UnitOfWork.ProductRepository.GetProductByIdAsync(productId);

            if (product == null) return null;

            var productDetailDtos = product.TblProductDetails
                .Select(pd => new ProductDetailDto
                {
                    ProductDetailId = pd.ProductDetailId, 
                    SerialNumber = pd.SerialNumber, 
                    Price = pd.Price, 
                    Description = product.ProductDescription, 

                    ProductImages = product.TblProductImages
                        .Select(img => img.ImageURL)
                        .ToList(),

                    QuantityAvailable = pd.TblInventories
                        .Select(i => i.QuantityAvailable)
                        .FirstOrDefault(),
                    QuantityReserved = pd.TblInventories
                        .Select(i => i.QuantityReserved)
                        .FirstOrDefault(),

                    TypeName = product.Type.TypeName,
                    CategoryName = product.Type.Category.CategoryName,

                    Attributes = pd.LkpProductDetailsAttributes
                        .Select(a => new ProductAttributeDto
                        {
                            AttributeName = a.Attribute.Name,
                            MeasureUnit = a.MeasureUnit.Name
                        })
                        .ToList()
                }).ToList(); 

            return productDetailDtos;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _UnitOfWork.ProductRepository.GetAllProductsAsync();

            return products.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                ProductName = p.ProductName,
                ProductDescription = p.ProductDescription,
                TypeName = p.Type.TypeName,
                ProductImageUrl = p.TblProductImages.FirstOrDefault()?.ImageURL
            }).ToList();
        }

        public async Task<IEnumerable<ProductDto>> GetProductsByCategoryIdAsync(int categoryId)
        {
            var products = await _UnitOfWork.ProductRepository.GetProductsByCategoryIdAsync(categoryId);

            return products.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                ProductName = p.ProductName,
                ProductDescription = p.ProductDescription,
                TypeName = p.Type.TypeName,
                ProductImageUrl = p.TblProductImages.FirstOrDefault()?.ImageURL
            }).ToList();
        }

        public async Task<IEnumerable<ProductDto>> GetProductsBySubCategoryIdAsync(int subCategoryId)
        {
            var products = await _UnitOfWork.ProductRepository.GetProductsBySubCategoryIdAsync(subCategoryId);

            return products.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                ProductName = p.ProductName,
                ProductDescription = p.ProductDescription,
                TypeName = p.Type.TypeName,
                ProductImageUrl = p.TblProductImages.FirstOrDefault()?.ImageURL
            }).ToList();
        }
    }
}
