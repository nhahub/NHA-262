using System;

namespace Cartify.Application.Contracts
{
	public class dtoSendEmail
	{
		public string SenderName { get; set; } = "Cartify Support";

		public string SenderEmail { get; set; } = "999cb7001@smtp-brevo.com";

		public string ToName { get; set; }

		public string ToEmail { get; set; }

		public string Subject { get; set; } 

		public string TextContent { get; set; }



	}
}
