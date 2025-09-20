using Backend.DTO;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Backend.Controllers
{
	//http://localhost:5259
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly EcommerceDBContext _context;
		public UsersController(EcommerceDBContext context)
		{
			_context = context;
		}
		[HttpPost("submit")]
		public IActionResult Register([FromForm] RegisterForm form)
		{
			if (_context.TblUsers.Any(u => u.UserName == form.UserName))
			{
				return BadRequest("Username already exists");
			}


			var user = new TblUser
			{
				FirstName = form.FirstName,
				LastName = form.LastName,
				Email = form.Email,
				Mobile = form.Telephone,
				PasswordHash = form.Password,
				Gender = (form.Gender == "Male") ? false : true,// false=Male, true=Female
				BirthDate = form.BirthDate,



			};
			var address = new TblAdress
			{
				UserId = user.UserId,
				City = form.City,
				PostalCode = form.ZipCode,
				Country = form.Country,
				State = form.State


			};
			return Ok();

		}
		[HttpPost("login")]
		public IActionResult Login([FromForm] LoginForm form)
		{
			var user = _context.TblUsers.FirstOrDefault(u => u.UserName == form.username);
			if (user != null)
			{
				if (user.PasswordHash == form.password)
				{
					return Ok();

				}
				return NotFound("Username or password is incorrect");

			}

			return NotFound("Username or password is incorrect");


		}

	}
}
