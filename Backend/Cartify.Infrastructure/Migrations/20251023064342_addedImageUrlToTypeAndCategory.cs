using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cartify.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addedImageUrlToTypeAndCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "TblTypes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "TblCategories",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "TblTypes");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "TblCategories");
        }
    }
}
