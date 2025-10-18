using Cartify.Application.Implementation;
using Cartify.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cartify.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubCategoryController : ControllerBase
    {
        private readonly ISubCategoryService _subCategoryService;
        public SubCategoryController(ISubCategoryService subCategoryService)
        {
            _subCategoryService = subCategoryService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var subcategories = await _subCategoryService.GetAllSubCategories();
            if (subcategories == null) return NotFound();
            return Ok(subcategories);
        }
    }
}
