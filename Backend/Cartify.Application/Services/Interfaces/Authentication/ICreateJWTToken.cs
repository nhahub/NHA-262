using Cartify.Application.Contracts;
using Cartify.Domain.Entities;
using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Services.Interfaces.Authentication
{
	public interface ICreateJWTToken
	{
		dtoTokenResult CreateToken(TblUser user,string Role);
		RefreshToken CreateRefreshToken();
	}
}
