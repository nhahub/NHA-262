using Backend.DTO;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

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
		[HttpPost("Register")]
		public IActionResult Register([FromForm] RegisterForm form)
		{

			var address = new TblAddress
			{
				City = form.City,
				PostalCode = form.ZipCode,
				Country = form.Country,
				State = form.State


			};
			var user = new TblUser
			{
				Email = form.Email,
				UserName=form.UserName,
				PasswordHash = form.Password.GetHashCode().ToString(),
				FirstName = form.FirstName,
				LastName = form.LastName,
				Gender = (form.Gender == "Male") ? false : true,// false=Male, true=Female
				BirthDate = form.BirthDate,
				Mobile = form.Telephone,
				BackupMobile=form.Telephone


			};
			user.TblAddresses.Add(address);
			_context.TblUsers.Add(user);
			_context.SaveChanges();
			return Ok();

		}
		[HttpPost("login")]
		public IActionResult Login([FromForm] LoginForm form)
		{
			var user = _context.TblUsers.FirstOrDefault(u => u.UserName == form.username);
			if (user != null)
			{
				if (user.PasswordHash == form.password.GetHashCode().ToString())
				{
					return Ok();

				}

			}

			return NotFound("Username or password is incorrect");


		}
		[HttpPost("CheckEmail")]
		public IActionResult checkEmail([FromForm] string email)
		{
			bool check=_context.TblUsers.Any(u=>u.Email==email);
			if (check)
			{
				return Ok();
			}
			return NotFound();
		}
		[HttpPost("CheckUsername")]
		public IActionResult CheckUsername([FromForm] string user)
		{
			bool check = _context.TblUsers.Any(u => u.UserName == user);
			if (check)
			{
				return Ok();
			}
			return NotFound();
		}
		[HttpPost("Register/CheckEmail")]
		public IActionResult RegistercheckEmail([FromForm] string email)
		{
			bool check = _context.TblUsers.Any(u => u.Email == email);
			return Ok(new { exist = check });

		}
		[HttpPost("Register/CheckUsername")]
		public IActionResult RegisterCheckUsername([FromForm] string user)
		{
			bool check = _context.TblUsers.Any(u => u.UserName == user);

			return Ok(new {exist =check});
		}
	}
}
