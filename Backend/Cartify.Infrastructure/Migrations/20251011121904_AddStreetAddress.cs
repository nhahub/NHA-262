using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cartify.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStreetAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StreetAddress",
                table: "TblAddresses",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StreetAddress",
                table: "TblAddresses");
        }
    }
}
