using Cartify.Application.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Services.Interfaces.Authentication
{
	public interface ICreateMerchantProfile
	{
		Task<dtoTokenResult> CreateProfile(string Email,string storeName);
	}
}
