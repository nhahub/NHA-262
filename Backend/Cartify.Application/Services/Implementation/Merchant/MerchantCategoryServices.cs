using Cartify.Application.Contracts;
using Cartify.Application.Contracts.CategoryDtos;
using Cartify.Application.Services.Interfaces.Merchant;
using Cartify.Infrastructure.Implementation.Repository;

namespace Cartify.Application.Services.Implementation.Merchant
{
    public class MerchantCategoryServices : IMerchantCategoryServices
    {
        public Task<bool> CreateCategoryAsync(CreateCategoryDto dto)
        {
            this._unitOfWork = _unitOfWork;
            this._fileStorageService = _fileStorageService;
        }

        public async Task<bool> CreateCategoryAsync(CreateCategoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CategoryName))
                return false;

            var existingCategory = await _unitOfWork.CategoryRepository
                .Search(c => c.CategoryName == dto.CategoryName && !c.IsDeleted);

            if (existingCategory != null)
                return false; 

            string? imageUrl = null;
            if (dto.Image != null)
            {
                imageUrl = await _fileStorageService.UploadFileAsync(dto.Image, "categories");
            }

            var category = new TblCategory
            {
                CategoryName = dto.CategoryName,
                CategoryDescription = dto.Description,
                ImageUrl = imageUrl, 
                IsDeleted = false,
                CreatedDate = DateTime.UtcNow
            };

            await _unitOfWork.CategoryRepository.CreateAsync(category);

            await _unitOfWork.SaveChanges();

            return true;
        }


        public async Task<bool> DeleteCategoryAsync(int categoryId)
        {
            var category = await _unitOfWork.CategoryRepository.ReadByIdAsync(categoryId);
            if (category == null) return false;

            category.IsDeleted = true;
            category.DeletedDate = DateTime.UtcNow;

            _unitOfWork.CategoryRepository.Update(category);
            await _unitOfWork.SaveChanges();

            return true;
        }


        public async Task<PagedResult<CategoryDto>> GetAllCategoriesAsync(int page = 1, int pageSize = 10)
        {
            var allCategories = await _unitOfWork.CategoryRepository.GetAll();
            var totalCount = allCategories.Count();
            var pagedData = allCategories
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CategoryDto
                {
                    CategoryId = c.CategoryId,
                    CategoryName = c.CategoryName,
                    CategoryDescription = c.CategoryDescription,
                    ImageUrl = c.ImageUrl
                })
                .ToList();

            return new PagedResult<CategoryDto>
            {
                Items = pagedData,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(int categoryId)
        {
            var category = await _unitOfWork.CategoryRepository.ReadByIdAsync(categoryId);
            if (category == null) return null;

            return new CategoryDto
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName,
                CategoryDescription = category.CategoryDescription,
                ImageUrl = category.ImageUrl
            };
        }

        public async Task<PagedResult<ProductDto>> GetProductByCategoryIdAsync(int categoryId, int page = 1, int pageSize = 10)
        {
            var products = await _unitOfWork.ProductRepository.GetAllIncluding(p=>p.Type.CategoryId== categoryId);


            if (products == null)
                return new PagedResult<ProductDto>(Enumerable.Empty<ProductDto>(), 0, page, pageSize);

            var allProducts = await _unitOfWork.ProductRepository.GetAllIncluding(
                p => p.Type,
                p => p.Type.Category,
                p => p.TblProductImages
            );

            var totalCount = allProducts.Count();

            var pagedProducts = allProducts
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var productDtos = pagedProducts.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                ProductName = p.ProductName,
                ProductDescription = p.ProductDescription,
                TypeName = p.Type?.TypeName ?? "",
                CategoryName = p.Type?.Category?.CategoryName ?? "",
                StoreId = p.UserStoreId,
                ImageUrl = p.TblProductImages != null && p.TblProductImages.Any()
                            ? p.TblProductImages.First().ImageURL
                            : null
            }).ToList();

            return new PagedResult<ProductDto>(productDtos, totalCount, page, pageSize);
        }


        public async Task<PagedResult<ProductDto>> GetProductBySubCategoryIdAsync(int TypeId, int page = 1, int pageSize = 10)
        {
            var products = await _unitOfWork.ProductRepository.GetAllIncluding(p => p.TypeId== TypeId);


            if (products == null)
                return new PagedResult<ProductDto>(Enumerable.Empty<ProductDto>(), 0, page, pageSize);

            var allProducts = await _unitOfWork.ProductRepository.GetAllIncluding(
                p => p.Type,
                p => p.Type.Category,
                p => p.TblProductImages
            );

            var totalCount = allProducts.Count();

            var pagedProducts = allProducts
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var productDtos = pagedProducts.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                ProductName = p.ProductName,
                ProductDescription = p.ProductDescription,
                TypeName = p.Type?.TypeName ?? "",
                CategoryName = p.Type?.Category?.CategoryName ?? "",
                StoreId = p.UserStoreId,
                ImageUrl = p.TblProductImages != null && p.TblProductImages.Any()
                            ? p.TblProductImages.First().ImageURL
                            : null
            }).ToList();

            return new PagedResult<ProductDto>(productDtos, totalCount, page, pageSize);
        }


        public async Task<int> GetProductCountByCategoryIdAsync(int categoryId)
        {
            var products = await _unitOfWork.ProductRepository.GetAllIncluding(p=>p.Type.CategoryId == categoryId);
            return products.Count();
        }
        public async Task<bool> UpdateCategoryAsync(int categoryId, UpdateCategoryDto dto)
        {
            var category = await _unitOfWork.CategoryRepository.ReadByIdAsync(categoryId);
            if (category == null)
                return false;

            category.CategoryName = dto.CategoryName;
            category.CategoryDescription = dto.CategoryDescription;
            category.ImageUrl = dto.ImageUrl;
            category.DeletedDate = null;

            _unitOfWork.CategoryRepository.Update(category);
            await _unitOfWork.SaveChanges();

            return true;
        }

    }

}

