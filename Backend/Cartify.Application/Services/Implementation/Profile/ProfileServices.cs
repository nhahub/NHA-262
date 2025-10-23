using Cartify.Application.Services.Interfaces;
using Cartify.Domain.Interfaces.Repositories;
using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Services.Implementation.Profile
{
    public class ProfileServices : IProfileServices
    {
        private readonly IUnitOfWork unitOfWork;

        public ProfileServices(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<TblUser> GetUsersProfilePicture(int id)
        {
            return await unitOfWork.ProfileRepository.GetUser(id);
            //var ProfilePicture = unitOfWork.ProfileRepository.GetUser(id).select(imgurl);
           // return await ProfilePicture;
        }
    }
}
