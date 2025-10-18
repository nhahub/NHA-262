using Cartify.Application.Implementation;
using Cartify.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cartify.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductServices _services;
        public ProductController(IProductServices _services)
        {
            this._services = _services;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _services.GetAllProductsAsync();
            if (products == null) return NotFound();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDetails(int id)
        {
            var product = await _services.GetProductDetailsAsync(id);

            if (product == null)
                return NotFound();
            return Ok(product);
        }
    }
}
