using Cartify.Application.Contracts.AuthenticationDtos;
using Cartify.Application.Services.Interfaces.Authentication;
using Cartify.Domain.Interfaces.Repositories;
using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Services.Implementation.Authentication
{
	public class CreateMerchantProfile : ICreateMerchantProfile
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IUserService _userService;
		private readonly ICreateJWTToken _createJWT;

		public CreateMerchantProfile(IUnitOfWork unitOfWork,IUserService userService,ICreateJWTToken createJWT) {
			_unitOfWork = unitOfWork;
			_userService = userService;
			_createJWT = createJWT;
		}
		public async Task<dtoTokenResult> CreateProfile(string Email,string storeName)
		{
			var userStore=new TblUserStore { StoreName = storeName };
			var user =await _userService.GetByEmail(Email);
			await _userService.AddRoleToUserAsync(user, "Merchant");
			user.StoresPurchasedFrom.Add(userStore);
			await _userService.UpdateAsync(user);
			var roles=(await _userService.GetRolesAsync(user)).ToList();
			dtoTokenResult Tokens = new dtoTokenResult();
			var jwtTokens = _createJWT.CreateToken(user, roles);
			Tokens.Jwt = jwtTokens.Jwt;
			Tokens.JwtExpiry = jwtTokens.JwtExpiry;
			return Tokens;

		}
	}
}
