using AutoMapper;
using Cartify.Application.Contracts;
using Cartify.Application.Interfaces;
using Cartify.Application.Interfaces.Repository;
using Cartify.Application.Interfaces.Service;
using Cartify.Domain.Models;

namespace Cartify.Application.Implementation
{	
	public class RegisterService : IRegisterService
	{
		private readonly IUnitOfWork _unitOfWork;
		private IMapper _mapper;
		public RegisterService(IUnitOfWork unitOfWork , IMapper mapper)
		{
			_unitOfWork = unitOfWork;
			_mapper = mapper;
		}
		public async Task<string> HashingPassword(string pw) => await Task.FromResult(BCrypt.Net.BCrypt.HashPassword(pw));

		public async Task<string> Register(dtoRegister register)
		{
			var user=_mapper.Map<TblUser>(register);
			var address = _mapper.Map<TblAddress>(register);

			var check = await _unitOfWork.Users.GetByEmail(user.Email);
			if (check != null)
			{
				return ResultService.Failure("Email already exists!");
			}
			var check2 = await _unitOfWork.Users.GetByUsername(user.UserName);
			if (check2 != null)
			{
				return ResultService.Failure("Username already exists!");
			}
			user.PasswordHash= await HashingPassword(user.PasswordHash);
			user.TblAddresses.Add(address);

			await _unitOfWork.Users.CreateAsync(user);
			await _unitOfWork.SaveChanges();
			return ResultService.Success();
		}
	}
}
