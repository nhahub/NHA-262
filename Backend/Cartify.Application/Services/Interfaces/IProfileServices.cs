using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Services.Interfaces
{
    public interface IProfileServices
    {
        Task<TblUser> GetUsersProfilePicture(int id);
    }
}

// 1 - IXRepo 
// 2 - XRepo
// 3 - Dependcy injection IUnitofWork !!
// 4 - Dependcy injecttion UnitofWork !!
// 5 - IXServices
// 6 - foledr -> XServices
// 7 - Dependcy injection in Program.cs !!
// 8 - XController !!
// 9 - Test on Swagger !!


