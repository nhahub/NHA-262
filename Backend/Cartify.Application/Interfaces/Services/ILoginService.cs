namespace Cartify.Application.Interfaces.Service
{
	public interface ILoginService
	{
		Task<bool> Login(string _user, string _password);
		Task<bool> CheckPassword(string _password ,string _storedPassword);


	}
}
