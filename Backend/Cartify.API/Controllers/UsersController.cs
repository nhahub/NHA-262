using Cartify.API.Contracts;
using Cartify.Core.Interfaces;
using Cartify.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cartify.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private IRegisterService _registerService;
		private ILoginService _loginService;
		public UsersController( IRegisterService registerService, ILoginService loginService)
		{
			_registerService = registerService;
			_loginService = loginService;
		}
		[HttpPost("Register")]
		public async Task<ActionResult> Register([FromForm] RegisterForm form)
		{

			var user = new TblUser
			{
				Email = form.Email,
				UserName = form.UserName,
				PasswordHash =form.Password,
				FirstName = form.FirstName,
				LastName = form.LastName,
				Gender = (form.Gender == "Male") ? false : true,// false=Male, true=Female
				BirthDate = form.BirthDate,
				Mobile = form.Telephone,
				BackupMobile = form.Telephone


			};
			var address = new TblAddress
			{
				City = form.City,
				PostalCode = form.ZipCode,
				Country = form.Country,
				State = form.State


			};
			string state = await _registerService.Register(user, address);
			if (state == "Success")
			{
				return Ok(state);
			}
			return BadRequest(state);


		}
		[HttpPost("Login")]
		public async Task<ActionResult> Login([FromForm] LoginForm form)
		{
			bool verify= await _loginService.Login(form.username, form.password);
			if (verify)
			{
				return Ok("success!");
			}
			return BadRequest("Username or password is wrong!");
		}
	}
}
