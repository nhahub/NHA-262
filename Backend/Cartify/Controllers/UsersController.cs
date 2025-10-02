using Backend.DTO;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
		public async Task<ActionResult>Register([FromForm] RegisterForm form)
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
			await _context.SaveChangesAsync();
			return Ok();

		}
		[HttpPost("login")]
		public async Task<ActionResult> Login([FromForm] LoginForm form)
		{
			var user = await _context.TblUsers.FirstOrDefaultAsync(u => u.UserName == form.username);
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
		public async Task<ActionResult> checkEmail([FromForm] string email)
		{
			bool check=await _context.TblUsers.AnyAsync(u=>u.Email==email);
			if (check)
			{
				return Ok();
			}
			return NotFound();
		}
		[HttpPost("CheckUsername")]
		public async Task<ActionResult> CheckUsername([FromForm] string user)
		{
			bool check =await _context.TblUsers.AnyAsync(u => u.UserName == user);
			if (check)
			{
				return Ok();
			}
			return NotFound();
		}
		[HttpPost("Register/CheckEmail")]
		public async Task<ActionResult> RegistercheckEmail([FromForm] string email)
		{
			bool check = await _context.TblUsers.AnyAsync(u => u.Email == email);
			return Ok(new { exist = check });

		}
		[HttpPost("Register/CheckUsername")]
		public async Task<ActionResult> RegisterCheckUsername([FromForm] string user)
		{
			bool check = await _context.TblUsers.AnyAsync(u => u.UserName == user);

			return Ok(new {exist =check});
		}
	}
}
