using AutoMapper;
using Cartify.Application.Contracts;
using Cartify.Application.Interfaces;
using Cartify.Domain.Models;

namespace Cartify.Application.Implementation
{	
	public class RegisterService : IRegisterService
	{
		private IUserRepository _userRepository;
		private IMapper _mapper;
		public RegisterService(IUserRepository repository , IMapper mapper)
		{
			_userRepository = repository;
			_mapper = mapper;
		}
		public async Task<string> HashingPassword(string pw) => await Task.FromResult(BCrypt.Net.BCrypt.HashPassword(pw));

		public async Task<string> Register(dtoRegister register)
		{
			var user=_mapper.Map<TblUser>(register);
			var address = _mapper.Map<TblAddress>(register);

			var check = await _userRepository.GetByEmail(user.Email);
			if (check != null)
			{
				return ResultService.Failure("Email already exists!");
			}
			var check2 = await _userRepository.GetByUsername(user.UserName);
			if (check2 != null)
			{
				return ResultService.Failure("Username already exists!");
			}
			user.PasswordHash= await HashingPassword(user.PasswordHash);
			user.TblAddresses.Add(address);

			await _userRepository.CreateAsync(user);
			await _userRepository.SaveChanges();
			return ResultService.Success();
		}
	}
}
