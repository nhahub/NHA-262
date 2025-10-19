namespace Cartify.Application.Services.Implementation.Helper
{
	public static class ResultService
	{
		public static string Failure(string message)
		{
			return message;
		}

		public static string Success()
		{
			return "Success";
		}
	}

}
