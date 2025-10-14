using Cartify.Application.Implementation;
using Cartify.Application.Interfaces;
using Cartify.Application.Interfaces.Service;
using Cartify.Application.Mappings;
using Cartify.Infrastructure.Implementation;
using Cartify.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
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
			builder.Services.AddSwaggerGen(doc => {
				var filepath = Path.Combine(System.AppContext.BaseDirectory, "Cartify.API.xml");
				doc.IncludeXmlComments(filepath);
				doc.SwaggerDoc("v1",
					
				   new OpenApiInfo
				   {
					   Title = "Smart API For DEPI",
					   Version = "v1",
					   Description = " ASP .NET Core WebAPI Course ",
					   TermsOfService = new Uri("http://tempuri.org/terms"),
					   Contact = new OpenApiContact
					   {
						   Name = "Sayed Hawas",
						   Email = "sout_2000@hotmail.com",
					   },
				   });
			});

			builder.Services.AddAuthentication();

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

			app.UseAuthentication();

			app.UseAuthorization();


			app.MapControllers();

			app.Run();
		}
	}
}
