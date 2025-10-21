using Cartify.Application.Contracts;
using Cartify.Domain.Models;
using Microsoft.AspNetCore.Http;
using Cartify.Application.Services.Interfaces.Authentication;
using Cartify.Domain.Entities;
namespace Cartify.Application.Services.Implementation.Authentication
{
	public class LoginService : ILoginService
	{
		private readonly IUserService _userService;
		private readonly ICreateJWTToken _createJWTToken;
		private readonly IHttpContextAccessor _httpContextAccessor;

		public LoginService(IUserService userService, ICreateJWTToken createJWTToken, IHttpContextAccessor httpContextAccessor)
		{
			_userService = userService;
			_createJWTToken = createJWTToken;
			_httpContextAccessor = httpContextAccessor;
		}


		public async Task<dtoTokenResult> Login(dtoLogin dto)
		{
			TblUser? user = null;
			if (dto.Email.Contains("@"))
			{
				user = await _userService.GetByEmail(dto.Email);

			}
			else
			{
				user = await _userService.GetByUsername(dto.Email);

			}
			if (user == null)
			{
				return new dtoTokenResult { Success=false,ErrorMessage= "Username or password is wrong!" };
			}
			bool check = await _userService.CheckPassword(user, dto.password);
			if (!check)
			{
				return new dtoTokenResult { Success = false, ErrorMessage = "Username or password is wrong!" };
			}
			var Roles = await _userService.GetRolesAsync(user);


			RefreshToken refreshToken;


			if (user.RefreshTokens.Any(e => e.IsActive))
			{
				refreshToken = user.RefreshTokens.FirstOrDefault(e => e.IsActive);
			}
			else
			{
				refreshToken = _createJWTToken.CreateRefreshToken();
				user.RefreshTokens.Add(refreshToken);
				await _userService.UpdateAsync(user);
			}

			var cookieOptions = new CookieOptions
			{
				HttpOnly = true,
				Secure = _httpContextAccessor.HttpContext.Request.IsHttps, // true في الإنتاج
				SameSite = SameSiteMode.None, // لو الفرونت على دومين مختلف
				Expires = refreshToken.ExpiresOn.ToUniversalTime(),
				Path = "/"
			};
			_httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);


			dtoTokenResult Tokens = new dtoTokenResult();
			var jwtTokens = _createJWTToken.CreateToken(user, Roles.ToList());
			Tokens.Jwt = jwtTokens.Jwt;
			Tokens.JwtExpiry = jwtTokens.JwtExpiry;
			return Tokens;
		}

		public async Task<dtoTokenResult> RefreshToken(string token)
		{
			var user = await _userService.GetUserByToken(token);
			if (user == null)
			{
				return new dtoTokenResult { ErrorMessage = "Invalid Token" };
			}

			var refreshToken = user.RefreshTokens.SingleOrDefault(t => t.Token == token);
			if (refreshToken == null)
			{
				return new dtoTokenResult { ErrorMessage = "Token not found" };
			}

			if (!refreshToken.IsActive)
			{
				return new dtoTokenResult { ErrorMessage = "Inactive or expired token" };
			}

			refreshToken.RevokedOn = DateTime.UtcNow;

			var newRefreshToken = _createJWTToken.CreateRefreshToken();

			user.RefreshTokens.Add(newRefreshToken);

			var roles = await _userService.GetRolesAsync(user);
			var newAccessToken = _createJWTToken.CreateToken(user, roles.ToList());
			var cookieOptions = new CookieOptions
			{
				HttpOnly = true,
				Secure = _httpContextAccessor.HttpContext.Request.IsHttps,
				SameSite = SameSiteMode.None,
				Expires = newRefreshToken.ExpiresOn.ToUniversalTime(),
				Path = "/"
			};
			_httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);


			await _userService.UpdateAsync(user);

			return new dtoTokenResult
			{
				Success = true,
				Jwt = newAccessToken.Jwt,
				JwtExpiry=newAccessToken.JwtExpiry,

			};
		}
	}
}
