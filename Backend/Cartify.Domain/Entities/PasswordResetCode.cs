using Cartify.Domain.Models;
using System;

namespace Cartify.Domain.Entities
{
    public class PasswordResetCode
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public DateTime Expiration { get; set; }
        public bool IsUsed { get; set; } = false;

        // FK إلى TblUser
        public string UserId { get; set; } // أو int لو PK في TblUser int
        public virtual TblUser User { get; set; }
    }
}