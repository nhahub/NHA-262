using AutoMapper;
using Cartify.API.Contracts;
using Cartify.Application.Contracts;
using Cartify.Application.Services.Interfaces.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Net;
using System.Security.Claims;

namespace Cartify.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IRegisterService _registerService;
		private readonly ILoginService _loginService;
		private readonly IResetPassword _resetPassword;
		private readonly ICreateMerchantProfile _profile;

		public UsersController(IRegisterService registerService, ILoginService loginService, IMapper mapper,IResetPassword resetPassword, ICreateMerchantProfile profile)
		{
			_registerService = registerService;
			_loginService = loginService;
			_resetPassword = resetPassword;
			_profile = profile;
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
				Password = form.Password,
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
			var tokens = await _loginService.Login(user);
			if (!tokens.Success)
			{
				return BadRequest(tokens.ErrorMessage);
			}
			return Ok(new TokenResult { Jwt=tokens.Jwt,JwtExpiry=tokens.JwtExpiry});
		}
		[HttpPost("RefreshToken")]
		public async Task<IActionResult> RefreshToken()
		{
			var Token = Request.Cookies["refreshToken"];
			var tokens = await _loginService.RefreshToken(Token);
			if (!tokens.Success)
				return BadRequest(tokens.ErrorMessage);

			return Ok(new { Jwt = tokens.Jwt, JwtExpiry = tokens.JwtExpiry });
		}
		[HttpPost("test")]
		[Authorize]
		public async Task<IActionResult> test()
		{
			return Ok();
		}
		[HttpPost("ResetPassword/CheckEmailAndGenerateCode")]
		public async Task<IActionResult> ResetPassword([FromBody]string Email)
		{
			var result=await _resetPassword.Reset(new dtoSendEmail { ToEmail=Email});
			if (!result.Result)
			{
				return BadRequest(result.Message);
			}

			return Ok();
		}
		[HttpPost("ResetPassword/CheckCodeAndChangePassword")]
		public async Task<IActionResult> ResetPassword2([FromBody]ResetPW resetPW)
		{
			var result=await _resetPassword.CheckCode(resetPW.Code, resetPW.Password);

			if (!result.Result)
			{
				return BadRequest(result.Message);
			}

			return Ok();
		}
		[HttpPost("CreateMerchantProfile")]
		[Authorize(Roles ="User")]
		public async Task<IActionResult> CreateMerchantProfile([FromBody]string StoreName)
		{


			var Email = User.FindFirst(ClaimTypes.Email)?.Value;
			var token=await _profile.CreateProfile(Email, StoreName);
			return Ok(new TokenResult { Jwt = token.Jwt, JwtExpiry = token.JwtExpiry });
		}
	}
}
