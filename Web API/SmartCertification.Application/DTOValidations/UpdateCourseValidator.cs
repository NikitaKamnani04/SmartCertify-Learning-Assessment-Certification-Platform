using FluentValidation;
using SmartCertification.Application.DTOs;
using SmartCertification.Application.Interfaces.Courses;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartCertification.Application.DTOValidations
{
    public class UpdateCourseValidator : AbstractValidator<UpdateCourseDto>
    {
        public UpdateCourseValidator(ICourseRepository repository)
        {
            RuleFor(x => x.Title).NotEmpty().NotNull().MaximumLength(100)
                .MustAsync(async (title, cancellation) => title == null || !await repository.IsTitleDuplicateAsync(title))
                .WithMessage("The course title must be unique");
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(500);
             
        }
    }
}
