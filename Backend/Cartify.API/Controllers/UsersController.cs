using AutoMapper;
using Cartify.API.Contracts;
using Cartify.Application.Contracts;
using Cartify.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cartify.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private IRegisterService _registerService;
		private ILoginService _loginService;
		private IMapper _mapper;
		public UsersController( IRegisterService registerService, ILoginService loginService,IMapper mapper)
		{
			_registerService = registerService;
			_loginService = loginService;
			_mapper = mapper;
		}
		[HttpPost("Register")]
		public async Task<ActionResult> Register([FromForm] RegisterForm form)
		{
				
			var user = new dtoRegister
			{
				Email = form.Email,
				UserName = form.UserName,
				Password =form.Password,
				FirstName = form.FirstName,
				LastName = form.LastName,
				Gender = form.Gender, // false=Male, true=Female
				BirthDate = form.BirthDate,
				Telephone = form.Telephone,
				City = form.City,
				ZipCode = form.ZipCode,
				Country = form.Country,
				State = form.State,
				StreetAddress = form.StreetAddress
			};

			string state = await _registerService.Register(user);
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
