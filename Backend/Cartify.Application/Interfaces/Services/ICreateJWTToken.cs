using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Interfaces.Services
{
	public interface ICreateJWTToken
	{
		string CreateToken(TblUser user,string Role);
	}
}
