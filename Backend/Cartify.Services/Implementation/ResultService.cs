using Cartify.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Services.Implementation
{
	public class ResultService
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
