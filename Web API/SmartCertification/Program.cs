
using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Scalar.AspNetCore;
using SmartCertification.API.Filters;
using SmartCertification.Application;
using SmartCertification.Application.DTOs;
using SmartCertification.Application.Interfaces.Certification;
using SmartCertification.Application.Interfaces.Common;
using SmartCertification.Application.Interfaces.Courses;
using SmartCertification.Application.Interfaces.QuestionsChoice;
using SmartCertification.Application.Services;
using SmartCertification.Application.Services.Certification;
using SmartCertification.Application.Services.Common;
using SmartCertification.Domain.Entities;
using SmartCertification.Infrastructure;

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
            builder.Services.AddControllers(options =>
            {
                options.Filters.Add<ValidationFilter>();
            }).ConfigureApiBehaviorOptions(options =>
            {
                options.SuppressModelStateInvalidFilter = true;  //Disable automatic validation
            });
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddAutoMapper(typeof(MappingProfile));
            builder.Services.AddAuthorization();

            //Add fluentvalidation
            builder.Services.AddValidatorsFromAssemblyContaining<CreateCourseDto>();
            builder.Services.AddValidatorsFromAssemblyContaining<UpdateCourseDto>();

            builder.Services.AddScoped<ICourseRepository, CourseRepository>();
            builder.Services.AddScoped<ICourseService, CourseService>();
            builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
            builder.Services.AddScoped<IQuestionService, QuestionService>();
            builder.Services.AddScoped<IChoiceRepository, ChoiceRepository>();
            builder.Services.AddScoped<IChoiceService, ChoiceService>();
            builder.Services.AddScoped<IExamRepository, ExamRepository>();
            builder.Services.AddScoped<IExamService, ExamService>();
            builder.Services.AddScoped<IUserClaims, UserClaims>();
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("default", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

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
            app.UseRouting();
            app.UseCors("default");
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
