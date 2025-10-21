using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Cartify.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class anything : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    BirthDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Gender = table.Column<bool>(type: "bit", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "lkpAttributes",
                columns: table => new
                {
                    AttributeId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lkpAttributes", x => x.AttributeId);
                });

            migrationBuilder.CreateTable(
                name: "LkpOrderStatues",
                columns: table => new
                {
                    OrderStatuesId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LkpOrderStatues", x => x.OrderStatuesId);
                });

            migrationBuilder.CreateTable(
                name: "LkpPaymentTypes",
                columns: table => new
                {
                    PaymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblPayment", x => x.PaymentId);
                });

            migrationBuilder.CreateTable(
                name: "LkpShipementMethods",
                columns: table => new
                {
                    ShipementMethodId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: true),
                    Fees = table.Column<decimal>(type: "decimal(9,2)", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LkpShipementMethods", x => x.ShipementMethodId);
                });

            migrationBuilder.CreateTable(
                name: "LkpUnitOfMeasures",
                columns: table => new
                {
                    UnitOfMeasureId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LkpUnitOfMeasures", x => x.UnitOfMeasureId);
                });

            migrationBuilder.CreateTable(
                name: "TblCategories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    CategoryName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CategoryDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblCategories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshToken",
                columns: table => new
                {
                    TblUserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpiresOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RevokedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshToken", x => new { x.TblUserId, x.Id });
                    table.ForeignKey(
                        name: "FK_RefreshToken_AspNetUsers_TblUserId",
                        column: x => x.TblUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TblAddresses",
                columns: table => new
                {
                    AddressId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    State = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    StreetAddress = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PostalCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Country = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IsDefault = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblAdresses_1", x => x.AddressId);
                    table.ForeignKey(
                        name: "FK_TblAdresses_TblUsers",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TblOrders",
                columns: table => new
                {
                    OrderId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    OrderDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    OrderStatuesId = table.Column<int>(type: "int", nullable: false),
                    PaymentTypeId = table.Column<int>(type: "int", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalDiscount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    ShipmentMethodId = table.Column<int>(type: "int", nullable: false),
                    GrantTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Tax = table.Column<decimal>(type: "decimal(9,2)", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblOrders", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_TblOrders_LkpOrderStatues",
                        column: x => x.OrderStatuesId,
                        principalTable: "LkpOrderStatues",
                        principalColumn: "OrderStatuesId");
                    table.ForeignKey(
                        name: "FK_TblOrders_LkpPaymentTypes",
                        column: x => x.PaymentTypeId,
                        principalTable: "LkpPaymentTypes",
                        principalColumn: "PaymentId");
                    table.ForeignKey(
                        name: "FK_TblOrders_LkpShipementMethods",
                        column: x => x.ShipmentMethodId,
                        principalTable: "LkpShipementMethods",
                        principalColumn: "ShipementMethodId");
                });

            migrationBuilder.CreateTable(
                name: "LkpUnitMeasuresAttributes",
                columns: table => new
                {
                    UnitMeasureAttributeId = table.Column<int>(type: "int", nullable: false),
                    UnitOfMeasureId = table.Column<int>(type: "int", nullable: false),
                    AttributeId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LkpUnitMeasuresAttributes", x => x.UnitMeasureAttributeId);
                    table.ForeignKey(
                        name: "FK_LkpUnitOfMeasuresAttributes_LkpUnitOfMeasures",
                        column: x => x.UnitOfMeasureId,
                        principalTable: "LkpUnitOfMeasures",
                        principalColumn: "UnitOfMeasureId");
                    table.ForeignKey(
                        name: "FK_LkpUnitOfMeasuresAttributes_lkpAttributes",
                        column: x => x.AttributeId,
                        principalTable: "lkpAttributes",
                        principalColumn: "AttributeId");
                });

            migrationBuilder.CreateTable(
                name: "TblTypes",
                columns: table => new
                {
                    TypeId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    TypeName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TypeDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblTypes", x => x.TypeId);
                    table.ForeignKey(
                        name: "FK_TblTypes_TblCategories",
                        column: x => x.CategoryId,
                        principalTable: "TblCategories",
                        principalColumn: "CategoryId");
                });

            migrationBuilder.CreateTable(
                name: "LkpAttributesProducts",
                columns: table => new
                {
                    AttributeProductId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    AttriputeId = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LkpAttributesProducts", x => x.AttributeProductId);
                    table.ForeignKey(
                        name: "FK_LkpAttributesProducts_lkpAttributes",
                        column: x => x.AttriputeId,
                        principalTable: "lkpAttributes",
                        principalColumn: "AttributeId");
                });

            migrationBuilder.CreateTable(
                name: "TblProductDetails",
                columns: table => new
                {
                    ProductDetailId = table.Column<int>(type: "int", nullable: false),
                    UnitMeasureAttributeId = table.Column<int>(type: "int", nullable: false),
                    AttributeProductId = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblProductDetails", x => x.ProductDetailId);
                    table.ForeignKey(
                        name: "FK_TblProductDetails_LkpAttributesProducts",
                        column: x => x.AttributeProductId,
                        principalTable: "LkpAttributesProducts",
                        principalColumn: "AttributeProductId");
                    table.ForeignKey(
                        name: "FK_TblProductDetails_LkpUnitMeasuresAttributes",
                        column: x => x.UnitMeasureAttributeId,
                        principalTable: "LkpUnitMeasuresAttributes",
                        principalColumn: "UnitMeasureAttributeId");
                });

            migrationBuilder.CreateTable(
                name: "TblInventory",
                columns: table => new
                {
                    InventoryId = table.Column<int>(type: "int", nullable: false),
                    ProductDetailId = table.Column<int>(type: "int", nullable: false),
                    QuantityAvailable = table.Column<int>(type: "int", nullable: false),
                    QuantityReserved = table.Column<int>(type: "int", nullable: false),
                    ReorderLevel = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblInventory", x => x.InventoryId);
                    table.ForeignKey(
                        name: "FK_TblInventory_TblProductDetails",
                        column: x => x.ProductDetailId,
                        principalTable: "TblProductDetails",
                        principalColumn: "ProductDetailId");
                });

            migrationBuilder.CreateTable(
                name: "TblUserStore",
                columns: table => new
                {
                    UserStorId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    StoreName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    InventoryId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblUserStore", x => x.UserStorId);
                    table.ForeignKey(
                        name: "FK_TblUserStore_TblInventory",
                        column: x => x.InventoryId,
                        principalTable: "TblInventory",
                        principalColumn: "InventoryId");
                    table.ForeignKey(
                        name: "FK_TblUserStore_TblUsers",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TblProducts",
                columns: table => new
                {
                    ProductId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeId = table.Column<int>(type: "int", nullable: false),
                    AttributeId = table.Column<int>(type: "int", nullable: false),
                    UserStoreId = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ProductDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblProducts", x => x.ProductId);
                    table.ForeignKey(
                        name: "FK_TblProducts_TblTypes",
                        column: x => x.TypeId,
                        principalTable: "TblTypes",
                        principalColumn: "TypeId");
                    table.ForeignKey(
                        name: "FK_TblProducts_TblUserStore1",
                        column: x => x.UserStoreId,
                        principalTable: "TblUserStore",
                        principalColumn: "UserStorId");
                });

            migrationBuilder.CreateTable(
                name: "TblOrderDetails",
                columns: table => new
                {
                    OrderDetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    OrderId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Discount = table.Column<decimal>(type: "decimal(9,2)", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblOrderDetails", x => x.OrderDetailId);
                    table.ForeignKey(
                        name: "FK_TblOrderProducts_TblOrders",
                        column: x => x.OrderId,
                        principalTable: "TblOrders",
                        principalColumn: "OrderId");
                    table.ForeignKey(
                        name: "FK_TblOrderProducts_TblProducts",
                        column: x => x.ProductId,
                        principalTable: "TblProducts",
                        principalColumn: "ProductId");
                });

            migrationBuilder.CreateTable(
                name: "TblProductImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ImageURL = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblProductImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TblProductImages_TblProducts",
                        column: x => x.ProductId,
                        principalTable: "TblProducts",
                        principalColumn: "ProductId");
                });

            migrationBuilder.CreateTable(
                name: "TblProductsDetails",
                columns: table => new
                {
                    ProductDetailId = table.Column<int>(type: "int", nullable: false),
                    UnitMeasureAttributeId = table.Column<int>(type: "int", nullable: false),
                    productId = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblProductsDetails", x => x.ProductDetailId);
                    table.ForeignKey(
                        name: "FK_TblProductsDetails_LkpUnitMeasuresAttributes",
                        column: x => x.UnitMeasureAttributeId,
                        principalTable: "LkpUnitMeasuresAttributes",
                        principalColumn: "UnitMeasureAttributeId");
                    table.ForeignKey(
                        name: "FK_TblProductsDetails_TblProducts",
                        column: x => x.ProductDetailId,
                        principalTable: "TblProducts",
                        principalColumn: "ProductId");
                });

            migrationBuilder.CreateTable(
                name: "TblRefunds",
                columns: table => new
                {
                    RefundId = table.Column<int>(type: "int", nullable: false),
                    OrderDetailId = table.Column<int>(type: "int", nullable: false),
                    RefundStatues = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RefundAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.ForeignKey(
                        name: "FK_TblRefunds_TblOrderDetails",
                        column: x => x.OrderDetailId,
                        principalTable: "TblOrderDetails",
                        principalColumn: "OrderDetailId");
                });

            migrationBuilder.CreateTable(
                name: "TblReviews",
                columns: table => new
                {
                    ReviewId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    OrderDetailsId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    ReviewText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TblReviews", x => x.ReviewId);
                    table.ForeignKey(
                        name: "FK_TblReviews_TblOrderDetails",
                        column: x => x.OrderDetailsId,
                        principalTable: "TblOrderDetails",
                        principalColumn: "OrderDetailId");
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "8e75dee3-74df-43c8-8ded-ca9179be3480", "8e75dee3-74df-43c8-8ded-ca9179be3480", "User", "USER" },
                    { "c9ec0699-f839-4e8d-9bd3-12685ac984ab", "c9ec0699-f839-4e8d-9bd3-12685ac984ab", "Admin", "ADMIN" },
                    { "fdcd17c2-f208-45cc-98d1-e80720cf7896", "fdcd17c2-f208-45cc-98d1-e80720cf7896", "Merchant", "MERCHANT" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_LkpAttributesProducts_AttriputeId",
                table: "LkpAttributesProducts",
                column: "AttriputeId");

            migrationBuilder.CreateIndex(
                name: "IX_LkpAttributesProducts_ProductId",
                table: "LkpAttributesProducts",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_LkpUnitMeasuresAttributes_AttributeId",
                table: "LkpUnitMeasuresAttributes",
                column: "AttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_LkpUnitMeasuresAttributes_UnitOfMeasureId",
                table: "LkpUnitMeasuresAttributes",
                column: "UnitOfMeasureId");

            migrationBuilder.CreateIndex(
                name: "IX_TblAddresses_UserId",
                table: "TblAddresses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TblInventory_ProductDetailId",
                table: "TblInventory",
                column: "ProductDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_TblOrderDetails_OrderId",
                table: "TblOrderDetails",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_TblOrderDetails_ProductId",
                table: "TblOrderDetails",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_TblOrders_OrderStatuesId",
                table: "TblOrders",
                column: "OrderStatuesId");

            migrationBuilder.CreateIndex(
                name: "IX_TblOrders_PaymentTypeId",
                table: "TblOrders",
                column: "PaymentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_TblOrders_ShipmentMethodId",
                table: "TblOrders",
                column: "ShipmentMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_TblProductDetails_AttributeProductId",
                table: "TblProductDetails",
                column: "AttributeProductId");

            migrationBuilder.CreateIndex(
                name: "IX_TblProductDetails_UnitMeasureAttributeId",
                table: "TblProductDetails",
                column: "UnitMeasureAttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_TblProductImages_ProductId",
                table: "TblProductImages",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_TblProducts_TypeId",
                table: "TblProducts",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_TblProducts_UserStoreId",
                table: "TblProducts",
                column: "UserStoreId");

            migrationBuilder.CreateIndex(
                name: "IX_TblProductsDetails_UnitMeasureAttributeId",
                table: "TblProductsDetails",
                column: "UnitMeasureAttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_TblRefunds_OrderDetailId",
                table: "TblRefunds",
                column: "OrderDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_TblReviews_OrderDetailsId",
                table: "TblReviews",
                column: "OrderDetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_TblTypes_CategoryId",
                table: "TblTypes",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TblUserStore_InventoryId",
                table: "TblUserStore",
                column: "InventoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TblUserStore_UserId",
                table: "TblUserStore",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_LkpAttributesProducts_TblProducts",
                table: "LkpAttributesProducts",
                column: "ProductId",
                principalTable: "TblProducts",
                principalColumn: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_TblInventory_TblProductsDetails",
                table: "TblInventory",
                column: "ProductDetailId",
                principalTable: "TblProductsDetails",
                principalColumn: "ProductDetailId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TblUserStore_TblUsers",
                table: "TblUserStore");

            migrationBuilder.DropForeignKey(
                name: "FK_LkpAttributesProducts_TblProducts",
                table: "LkpAttributesProducts");

            migrationBuilder.DropForeignKey(
                name: "FK_TblProductsDetails_TblProducts",
                table: "TblProductsDetails");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "RefreshToken");

            migrationBuilder.DropTable(
                name: "TblAddresses");

            migrationBuilder.DropTable(
                name: "TblProductImages");

            migrationBuilder.DropTable(
                name: "TblRefunds");

            migrationBuilder.DropTable(
                name: "TblReviews");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "TblOrderDetails");

            migrationBuilder.DropTable(
                name: "TblOrders");

            migrationBuilder.DropTable(
                name: "LkpOrderStatues");

            migrationBuilder.DropTable(
                name: "LkpPaymentTypes");

            migrationBuilder.DropTable(
                name: "LkpShipementMethods");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "TblProducts");

            migrationBuilder.DropTable(
                name: "TblTypes");

            migrationBuilder.DropTable(
                name: "TblUserStore");

            migrationBuilder.DropTable(
                name: "TblCategories");

            migrationBuilder.DropTable(
                name: "TblInventory");

            migrationBuilder.DropTable(
                name: "TblProductDetails");

            migrationBuilder.DropTable(
                name: "TblProductsDetails");

            migrationBuilder.DropTable(
                name: "LkpAttributesProducts");

            migrationBuilder.DropTable(
                name: "LkpUnitMeasuresAttributes");

            migrationBuilder.DropTable(
                name: "LkpUnitOfMeasures");

            migrationBuilder.DropTable(
                name: "lkpAttributes");
        }
    }
}
