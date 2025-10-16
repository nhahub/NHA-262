using AutoMapper;
using Cartify.Application.Contracts;
using Cartify.Domain.Models;
namespace Cartify.Application.Mappings
{
	public class MappingProfile :Profile
	{
		public MappingProfile()
		{
			
			CreateMap<dtoRegister, TblUser>()
				.ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Telephone))
				.ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender=="Male"?false :true)
				);
			CreateMap<dtoRegister, TblAddress>();
			
		}
	}
}
