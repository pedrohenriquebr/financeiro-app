using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceiroApp.Core.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTypeFromBankAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "BankAccounts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "BankAccounts",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
