using Cartify.Application.Interfaces;
using Cartify.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Cartify.Infrastructure.Implementation
{
	public class CreateJWTToken : ICreateJWTToken
	{
		private readonly IConfiguration _configuration;

		public CreateJWTToken(IConfiguration configuration)
		{
			_configuration = configuration;
		}
		public  string CreateToken(TblUser user, string Role)
		{
			var claims = new List<Claim>();
			claims.Add(new Claim(ClaimTypes.Email,user.Email));
			claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
			claims.Add(new Claim(ClaimTypes.Role, Role));
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
			var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				claims: claims,
				notBefore: DateTime.Now,
				expires: DateTime.Now.AddMinutes(15),
				signingCredentials: credentials
			);




			return new JwtSecurityTokenHandler().WriteToken(token);
		
		}
	}
}
