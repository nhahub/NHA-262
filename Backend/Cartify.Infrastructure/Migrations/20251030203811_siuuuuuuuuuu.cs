using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cartify.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class siuuuuuuuuuu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TblUserStore_AspNetUsers_TblUserId",
                table: "TblUserStore");

            migrationBuilder.DropIndex(
                name: "IX_TblUserStore_TblUserId",
                table: "TblUserStore");

            migrationBuilder.DropIndex(
                name: "IX_TblUserStore_UserId",
                table: "TblUserStore");

            migrationBuilder.DropColumn(
                name: "TblUserId",
                table: "TblUserStore");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TblUserStore");

            migrationBuilder.AddColumn<string>(
                name: "MerchantId",
                table: "TblUserStore",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StoreId",
                table: "TblOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserStoreId",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TblUserStoreCustomers",
                columns: table => new
                {
                    UserStoreId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblUserStoreCustomers", x => new { x.UserStoreId, x.UserId });
                    table.ForeignKey(
                        name: "FK_UserStoreCustomers_User",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserStoreCustomers_UserStore",
                        column: x => x.UserStoreId,
                        principalTable: "TblUserStore",
                        principalColumn: "UserStorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TblOrders_UserStoreId",
                table: "TblOrders",
                column: "StoreId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_UserStoreId",
                table: "AspNetUsers",
                column: "UserStoreId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TblUserStoreCustomers_UserId",
                table: "TblUserStoreCustomers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TblUserStore_Merchant",
                table: "AspNetUsers",
                column: "UserStoreId",
                principalTable: "TblUserStore",
                principalColumn: "UserStorId");

            migrationBuilder.AddForeignKey(
                name: "FK_TblOrders_TblUserStore",
                table: "TblOrders",
                column: "StoreId",
                principalTable: "TblUserStore",
                principalColumn: "UserStorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TblUserStore_Merchant",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_TblOrders_TblUserStore",
                table: "TblOrders");

            migrationBuilder.DropTable(
                name: "TblUserStoreCustomers");

            migrationBuilder.DropIndex(
                name: "IX_TblOrders_UserStoreId",
                table: "TblOrders");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_UserStoreId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "MerchantId",
                table: "TblUserStore");

            migrationBuilder.DropColumn(
                name: "StoreId",
                table: "TblOrders");

            migrationBuilder.DropColumn(
                name: "UserStoreId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "TblUserId",
                table: "TblUserStore",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "TblUserStore",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TblUserStore_TblUserId",
                table: "TblUserStore",
                column: "TblUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TblUserStore_UserId",
                table: "TblUserStore",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TblUserStore_AspNetUsers_TblUserId",
                table: "TblUserStore",
                column: "TblUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
