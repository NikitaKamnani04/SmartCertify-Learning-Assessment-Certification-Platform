using FluentValidation;
using SmartCertification.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartCertification.Application.DTOValidations
{
    public class StartExamRequestValidator : AbstractValidator<StartExamRequest>
    {
        public StartExamRequestValidator()
        {
            RuleFor(x => x.CourseId).GreaterThan(0).WithMessage("CourseId must be greater than 0.");

            RuleFor(x => x.UserId).GreaterThan(0).WithMessage("UserId must be greater than 0.");

        }
    }
}
