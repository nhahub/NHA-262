using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cartify.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class MerchantsController : ControllerBase
	{
		[HttpGet("GetMerchantOrders")]
		public async Task<IActionResult> GetMerchantOrders()
		{
			return Ok();
		}
		[HttpGet("GetMerchantProducts")]
		public async Task<IActionResult> GetMerchantProducts()
		{
			return Ok();
		}
		[HttpGet("GetMerchantCustomers")]
		public async Task<IActionResult> GetMerchantCustomers()
		{
			return Ok();
		}
		[HttpPost("AddProducts")]
		public async Task<IActionResult> AddProducts()
		{
			return Ok();
		}

	}
}
