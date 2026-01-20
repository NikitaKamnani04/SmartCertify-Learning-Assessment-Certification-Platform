
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SmartCertification.Domain.Entities;

namespace SmartCertification
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<SmartCertifyContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DbContext"),
                    providerOptions => providerOptions.EnableRetryOnFailure());
            });
            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference(options =>
                {
                    options.WithTitle("My API");
                    options.WithTheme(ScalarTheme.BluePlanet);
                    options.WithSidebar(false);
                });
            }

            app.UseSwaggerUi(options =>
            {
                options.DocumentPath = "openapi/v1.json";
            });

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors();

            app.MapControllers();

            app.Run();
        }
    }
}
