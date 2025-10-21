using Cartify.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Services.Interfaces
{
    public interface ICategoryService
    {
        public Task<IEnumerable<TblCategory>> GetAllCategories();
    }
}
