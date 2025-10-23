using Cartify.Application.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cartify.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileServices profileServices;
        public ProfileController(IProfileServices profileServices)
        {
            this.profileServices = profileServices;
        }

    }
}
