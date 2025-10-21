using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Infrastructure.Implementation.Services.Helper
{
	public class SMTPSettings
	{
		public string SMTPServer { get; set; }
		public int Port { get; set; }
		public string Login { get; set; }
		public string Password { get; set; }

	}
}
