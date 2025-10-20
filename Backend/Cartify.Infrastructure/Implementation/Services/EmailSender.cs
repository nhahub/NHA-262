using Cartify.Application.Services.Interfaces.Authentication;
using Cartify.Infrastructure.Implementation.Services.Helper;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Cartify.Infrastructure.Implementation.Services
{
	public class EmailSender: IEmailSender
	{
		private readonly IOptions<SMTPSettings> _options;

		public EmailSender(IOptions<SMTPSettings> options)
		{
			_options = options;
		}

		public void SendEmail(string senderName, string senderEmail, string toName, string toEmail, string subject, string textContext)
		{
			var message = new MimeMessage();
			message.From.Add(new MailboxAddress(senderName, senderEmail));
			message.To.Add(new MailboxAddress(toName, toEmail));
			message.Subject = subject;
			message.Body = new TextPart("html")
			{
				Text = textContext
			};

			using (var client = new SmtpClient())
			{
				client.Connect(_options.Value.SMTPServer, _options.Value.Port, false);

				// Note: only needed if the SMTP server requires authentication
				client.Authenticate(_options.Value.Login, _options.Value.Password);

				try
				{
					var result=client.Send(message);
					Console.WriteLine(result);
					client.Disconnect(true);
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.ToString());
				}				
			}
		}
	}
}
