using AutoMapper;
using Cartify.API.Contracts;
using Cartify.Application.Contracts;
using Cartify.Application.Interfaces.Service;
using Microsoft.AspNetCore.Mvc;

namespace Cartify.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IRegisterService _registerService;
		private readonly ILoginService _loginService;
		public UsersController( IRegisterService registerService, ILoginService loginService,IMapper mapper)
		{
			_registerService = registerService;
			_loginService = loginService;
		}
		/// <summary>
		/// Registers a new user using the provided form data.
		/// </summary>
		/// <param name="form">
		/// The registration form containing user information such as email, username, password, and personal details.
		/// </param>
		/// <returns>
		/// Returns 200 (OK) if the registration succeeds, or 400 (Bad Request) with an error message if it fails.
		/// </returns>
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
		/// <summary>
		/// Authenticates a user using the provided login credentials.
		/// </summary>
		/// <param name="form">
		/// The login form containing the user's username and password.
		/// </param>
		/// <returns>
		/// Returns 200 (OK) with a success message if authentication is successful, 
		/// or 400 (Bad Request) if the username or password is incorrect.
		/// </returns>
		[HttpPost("Login")]

		public async Task<ActionResult> Login([FromForm] LoginForm form)
		{
			var user = new dtoLogin
			{
				Email = form.username,
				password = form.password,
			};
			string verify= await _loginService.Login(user);
			if (verify.Equals("Username or password is wrong!"))
			{
			return BadRequest(verify);
			}
				return Ok(verify);
		}
	}
}
