using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Cartify.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Addeddatatoidentityrole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "8e75dee3-74df-43c8-8ded-ca9179be3480", "8e75dee3-74df-43c8-8ded-ca9179be3480", "User", "USER" },
                    { "c9ec0699-f839-4e8d-9bd3-12685ac984ab", "c9ec0699-f839-4e8d-9bd3-12685ac984ab", "Admin", "ADMIN" },
                    { "fdcd17c2-f208-45cc-98d1-e80720cf7896", "fdcd17c2-f208-45cc-98d1-e80720cf7896", "Merchant", "MERCHANT" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8e75dee3-74df-43c8-8ded-ca9179be3480");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c9ec0699-f839-4e8d-9bd3-12685ac984ab");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fdcd17c2-f208-45cc-98d1-e80720cf7896");
        }
    }
}
