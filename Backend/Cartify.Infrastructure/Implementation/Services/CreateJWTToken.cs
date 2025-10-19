using Cartify.Domain.Models;
using Cartify.Infrastructure.Implementation.Services.Helper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using Cartify.Application.Contracts;

using Cartify.Domain.Entities;
using Cartify.Application.Services.Interfaces.Authentication;
namespace Cartify.Infrastructure.Implementation.Services
{

	public class CreateJWTToken : ICreateJWTToken
	{
		private readonly IOptions<JWTSettings> _options;

		public CreateJWTToken(IOptions<JWTSettings> options)
		{
			_options = options;
		}
		public dtoTokenResult CreateToken(TblUser user, string Role)
		{
			var claims = new List<Claim>();
			claims.Add(new Claim(JwtRegisteredClaimNames.Email,user.Email));
			claims.Add(new Claim(JwtRegisteredClaimNames.Sub, user.Id));
			claims.Add(new Claim(ClaimTypes.Role, Role));
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Value.Key));
			var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			var jwtToken = new JwtSecurityToken(
				issuer:_options.Value.Issuer,
				audience: _options.Value.Audience,
				claims: claims,
				notBefore: DateTime.UtcNow,
				expires: DateTime.UtcNow.AddMinutes(15),
				signingCredentials: credentials
			);

			var jwtString = new JwtSecurityTokenHandler().WriteToken(jwtToken);
			
			return new dtoTokenResult
			{
				Jwt = jwtString,
				JwtExpiry = jwtToken.ValidTo,
				Success=true
				
			};

		}
		public RefreshToken CreateRefreshToken()
		{
			var randomNumber = new byte[32];
			using var rng = new RNGCryptoServiceProvider();
			rng.GetBytes(randomNumber);
			var refreshToken = new RefreshToken
			{
				Token = Convert.ToBase64String(randomNumber),
				CreatedOn = DateTime.UtcNow,
				ExpiresOn = DateTime.UtcNow.AddDays(7),

			};
			return refreshToken;
		}
	}
}
