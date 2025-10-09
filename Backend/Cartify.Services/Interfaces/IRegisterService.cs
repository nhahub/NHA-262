using Cartify.Core.Models;

namespace Cartify.Core.Interfaces
{
	public interface IRegisterService
	{
		Task<string> Register(TblUser user, TblAddress address);
		Task<string> HashingPassword(string password);

	}
}
