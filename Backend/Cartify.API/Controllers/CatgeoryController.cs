using Cartify.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cartify.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatgeoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CatgeoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var Categories = await _categoryService.GetAllCategories();
            if (Categories == null) return NotFound();
            return Ok(Categories);
        }
    }
}
