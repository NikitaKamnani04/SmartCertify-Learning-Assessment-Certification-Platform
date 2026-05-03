using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartCertification.Application.DTOs;
using SmartCertification.Application.Interfaces.QuestionsChoice;
using SmartCertification.Application.Services;

namespace SmartCertification.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionService _service;

        public QuestionsController(IQuestionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetQuestions()
        {
            return Ok(await _service.GetAllQuestionsAsync());
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<QuestionDto>> GetQuestion(int id)
        {
            var question = await _service.GetQuestionByIdAsync(id);
            return question == null ? NotFound() : Ok(question);
        }


        //[HttpGet("{id}/choices")]
        //public async Task<ActionResult<IEnumerable<ChoiceDto>>> GetChoices(int id)
        //{
        //    var choices = await _service.GetChoicesByQuestionIdAsync(id);

        //    if (choices == null || !choices.Any())
        //        return NotFound();

        //    return Ok(choices);
        //}

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionDto dto)
        {
            await _service.AddQuestionAsync(dto);
            return CreatedAtAction(nameof(GetQuestion), new { id = dto.CourseId }, dto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] UpdateQuestionDto dto)
        {
            await _service.UpdateQuestionAsync(id, dto);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            await _service.DeleteQuestionAsync(id);
            return NoContent();
        }

        
        [HttpPost("CreateQuestionChoices")]
        public async Task<IActionResult> CreateQuestionChoices([FromBody] QuestionDto dto)
        {
            var createdResource = await _service.AddQuestionAndChoicesAsync(dto);
            return CreatedAtAction(nameof(GetQuestion), new { id = createdResource.QuestionId }, createdResource);
        }


        
        [HttpPut("UpdateQuestionAndChoices/{id:int}")]
        public async Task<IActionResult> UpdateQuestionAndChoices(int id, [FromBody] QuestionDto dto)
        {
            await _service.UpdateQuestionAndChoicesAsync(id, dto);
            return NoContent();
        }

        //[HttpPost("generate-questions")]
        //public async Task<IActionResult> GenerateQuestions([FromBody] string topic)
        //{
        //    var prompt = $"Generate 20 multiple choice questions on {topic}. " +
        //                 $"Each question should have 4 options and 1 correct answer. Return in JSON format.";

        //    var response = await _aiService.GenerateAsync(prompt);

        //    return Ok(response);
        //}

        [HttpGet("by-course/{courseId:int}")]
        public async Task<IActionResult> GetQuestionsByCourse(int courseId)
        {
            var questions = await _service.GetQuestionsByCourseIdAsync(courseId);
            return Ok(questions);
        }

    }
}
