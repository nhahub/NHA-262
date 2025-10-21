using Cartify.Application.Contracts;
using Cartify.Application.Services.Interfaces.Authentication;
using Cartify.Domain.Interfaces.Repositories;
using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Services.Implementation.Authentication
{
	public class ResetPassword : IResetPassword
	{
		private readonly IUserService _userService;
		private readonly IEmailSender _sender;
		private readonly IUnitOfWork _unitOfWork;

		public ResetPassword(IUserService userService, IEmailSender sender,IUnitOfWork unitOfWork)
		{
			_userService = userService;
			_sender = sender;
			_unitOfWork = unitOfWork;
		}
		public async Task<dtoResult> Reset(dtoSendEmail dto)
		{
			var user = await _userService.GetByEmail(dto.ToEmail);
			if (user == null)
			{
				return new dtoResult { Message = "Enter Valid email" };
			}
			dto.ToName=user.FirstName;
			dto.Subject = "Reset Password";
			var Code = await GenerateResetCodeAsync(user);
			string code = Code.Code;
			string basePath = AppDomain.CurrentDomain.BaseDirectory;
			string path = Path.Combine(basePath, @"..\..\..\..\Cartify.Application\Templates\ResetPassword.html");
			string htmlTemplate = File.ReadAllText(path);
			string codeHtml = "";
			foreach (var item in code)
			{
				codeHtml += $@"
        <div style=""display:inline-block; width:35px; height:40px; text-align:center; 
                    border-radius:8px; background-color:#37474f; color:#d6f8f2; 
                    font-size:18px; line-height:40px; user-select:all; 
                    margin-right:10px;"">{item}</div>";
			}
			// لو تحب آخر مربع ميبقاش عنده margin:
			codeHtml = codeHtml.TrimEnd();

			htmlTemplate = htmlTemplate.Replace("{code}", codeHtml);

			dto.TextContent = htmlTemplate;
			_sender.SendEmail(
				senderName: dto.SenderName,
				senderEmail: dto.SenderEmail,
				toName: dto.ToName,
				toEmail: dto.ToEmail,
				subject: dto.Subject,
				textContext: dto.TextContent
			);
			return new dtoResult { Message = "success", Result = true };
		}
		public async Task<PasswordResetCode> GenerateResetCodeAsync(TblUser user)
		{
			var code = Convert.ToInt32(RandomNumberGenerator.GetInt32(100000, 1000000)).ToString();

			var ResetCode =new PasswordResetCode { UserId = user.Id, Code = code,Expiration=DateTime.UtcNow.AddMinutes(10),IsUsed=false};
			user.PasswordResetCodes.Add(ResetCode);
			await _userService.UpdateAsync(user);
			return ResetCode;

		}

		public async Task<dtoResult> CheckCode(string code, string password)
		{
			var Code=await _unitOfWork.PasswordResetCodess.Search(e => e.Code == code);
			if (Code == null)
			{
				return new dtoResult { Message = "Invalid Code" };
			}
			if (Code.IsUsed||Code.Expiration<DateTime.UtcNow)
			{
				return new dtoResult { Message = "Code expired or already used" };

			}
			var user=await _userService.GetById(Code.UserId);
			if (user == null)
			{

				return new dtoResult { Message = "User not found" };
			}
			var result=await _userService.ChangePassword(user, password);
			if (result.Succeeded)
			{
				Code.IsUsed=true;
				_unitOfWork.PasswordResetCodess.Update(Code);
				await _unitOfWork.SaveChanges();
				return new dtoResult { Result = true ,Message="Password Changed Successfuly" };
			}

			return new dtoResult { Message = "Passowrd reset failed" };

		}
	}
}
