using Cartify.Application.Contracts;
using Cartify.Domain.Entities;
using Cartify.Domain.Models;

namespace Cartify.Application.Services.Interfaces.Authentication
{
	public interface IResetPassword
	{
		Task<dtoResult> Reset(dtoSendEmail dto);
		Task<PasswordResetCode> GenerateResetCodeAsync(TblUser user);
		Task<dtoResult> CheckCode(string code, string password);
	}
}
