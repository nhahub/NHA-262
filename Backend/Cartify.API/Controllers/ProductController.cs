using Cartify.Application.Services.Interfaces;
using Cartify.Application.Contracts;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cartify.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductServices _productService;

        public ProductController(IProductServices productService)
        {
            _productService = productService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("details/{productId}")]
        public async Task<IActionResult> GetProductDetails(int productId)
        {
            var productDetails = await _productService.GetProductDetailsAsync(productId);
            if (productDetails == null)
                return NotFound();
            return Ok(productDetails);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetProductsByCategoryId(int categoryId)
        {
            var products = await _productService.GetProductsByCategoryIdAsync(categoryId);
            return Ok(products);
        }

        [HttpGet("subcategory/{subCategoryId}")]
        public async Task<IActionResult> GetProductsBySubCategoryId(int subCategoryId)
        {
            var products = await _productService.GetProductsBySubCategoryIdAsync(subCategoryId);
            return Ok(products);
        }
    }
}
