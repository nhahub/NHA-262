using Cartify.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Interfaces.Services
{
    public interface ISubCategoryService
    {
        Task<IEnumerable<TblType>> GetAllSubCategories();
    }
}
