using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using SmartCertification.Application.DTOs;
using SmartCertification.Application.Interfaces.Courses;
using SmartCertification.Domain.Entities;

namespace SmartCertification.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _service;
        private readonly IValidator<CreateCourseDto> validator;
        private readonly IValidator<UpdateCourseDto> updateValidator;


        //private readonly IValidator<CreateCourseDto> validator;
        //private readonly IValidator<UpdateCourseDto> updateValidator;

        public CoursesController(ICourseService service,IValidator<CreateCourseDto> validator,IValidator<UpdateCourseDto> updateValidator)
        {
            this._service = service;
            this.validator = validator;
            this.updateValidator = updateValidator;
            //this.validator = validator;
            //this.updateValidator = updateValidator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CourseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllCoursesAsync()
        {
            var courses = await _service.GetAllCoursesAsync();
            return Ok(courses);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(CourseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]

        public async Task<ActionResult<CourseDto>> GetCourse([FromRoute] int id)
        {
            var course = await _service.GetCourseByIdAsync(id);
            return course == null ? NotFound() : Ok(course);
        }

        [HttpPost]
        [ProducesResponseType(typeof(CreateCourseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]

        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto createCourseDto)
        {
            var validationResult = await validator.ValidateAsync(createCourseDto);

            if(!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }
            await _service.AddCourseAsync(createCourseDto);
            return Ok(createCourseDto);
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(CreateCourseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]

        public async Task<IActionResult> UpdateCourse(int id, [FromBody] UpdateCourseDto updateCourseDto)
        {

            var validationResult = await updateValidator.ValidateAsync(updateCourseDto);

            if(!validationResult.IsValid)
            {   
                return BadRequest(validationResult.Errors);
            }
            await _service.UpdateCourseAsync(id, updateCourseDto);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(typeof(CreateCourseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]

        public async Task<IActionResult> DeleteCourse(int id)
        {
            await _service.DeleteCourseAsync(id);
            return NoContent();
        }

        [HttpPatch("{id:int}")]
        [ProducesResponseType(typeof(CreateCourseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]

        public async Task<IActionResult> UpdateDescription([FromRoute] int id, [FromBody] CourseUpdateDescriptionDto model)
        {
            await _service.UpdateDescriptionAsync(id, model.Description);
            return NoContent();
        }

    }
}
