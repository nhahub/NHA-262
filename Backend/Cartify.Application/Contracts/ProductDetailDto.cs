using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cartify.Application.Contracts {
    public class ProductDetailDto
    {
        public int ProductDetailId { get; set; }
        public string SerialNumber { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }

        public List<string> ProductImages { get; set; } = new();

        public int QuantityAvailable { get; set; }
        public int QuantityReserved { get; set; }

        public string TypeName { get; set; }
        public string CategoryName { get; set; }

        public List<ProductAttributeDto> Attributes { get; set; } = new();
    }


}
