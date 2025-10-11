using Cartify.Application.Implementation;
using Cartify.Application.Interfaces;
using Cartify.Application.Interfaces.Service;
using Cartify.Application.Mappings;
using Cartify.Infrastructure.Implementation;
using Cartify.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
namespace Cartify.API
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Add services to the container.

			builder.Services.AddControllers();
			builder.Services.AddCors(options =>
			{
				options.AddPolicy("AllowAll",
					policy =>
					{
						policy.AllowAnyOrigin()   
							  .AllowAnyMethod()   
							  .AllowAnyHeader();
					});
			});
			builder.Services.AddDbContext<AppDbContext>(options=>options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
			builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
			builder.Services.AddScoped<ILoginService, LoginService>();
			builder.Services.AddScoped<IRegisterService, RegisterService>();
			builder.Services.AddAutoMapper(typeof(MappingProfile));
			// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
			builder.Services.AddOpenApi();
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			var app = builder.Build();

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				app.UseCors("AllowAll");
				app.MapOpenApi();
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseHttpsRedirection();

			app.UseAuthorization();


			app.MapControllers();

			app.Run();
		}
	}
}
