using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Services.Interfaces.Authentication
{
	public interface IEmailSender
	{
		void SendEmail(string senderName,string senderEmail,string toName,string toEmail,string subject ,string textContext);
	}
}
