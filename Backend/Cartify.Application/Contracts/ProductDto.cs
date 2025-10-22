using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Contracts
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }
        public int TypeId { get; set; }
        public string TypeName { get; set; }
        public bool IsDeleted { get; set; }
        public string ProductImageUrl { get; set; }
    }

}
