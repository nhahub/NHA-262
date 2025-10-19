using Cartify.Application.Contracts;
using Cartify.Application.Services.Interfaces.Authentication;
using Cartify.Domain.Entities;
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
			var code = await GenerateResetCodeAsync(user);
			dto.TextContent = $"Your reset code is: {code.Code}";

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
		public async Task<PasswordResetCodes> GenerateResetCodeAsync(TblUser user)
		{
			var code = Convert.ToInt32(RandomNumberGenerator.GetInt32(100000, 1000000)).ToString();

			var ResetCode =new PasswordResetCodes { Code = code,Expiration=DateTime.UtcNow.AddMinutes(10),IsUsed=false};
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
