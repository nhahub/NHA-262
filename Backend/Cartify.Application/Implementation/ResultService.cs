namespace Cartify.Application.Implementation
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
