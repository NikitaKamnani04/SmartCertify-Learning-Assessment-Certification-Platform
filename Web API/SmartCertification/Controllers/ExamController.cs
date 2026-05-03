using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartCertification.Application.DTOs;
using SmartCertification.Application.DTOValidations;
using SmartCertification.Application.Interfaces.Certification;
using SmartCertification.Application.Interfaces.Common;

namespace SmartCertification.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly IExamService _examService;
        private readonly IUserClaims userClaims;

        public ExamController(IExamService examService, IUserClaims userClaims)
        {
            _examService = examService;
            this.userClaims = userClaims;
        }

        [HttpPost("start-exam")]
        public async Task<IActionResult> StartExam([FromBody] StartExamRequest request)     
        {
            var validator = new StartExamRequestValidator();
            var validationResult = validator.Validate(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));
            }
            try
            {
                var result = await _examService.StartExamAsync(request.CourseId, request.UserId);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("update-user-choice/{id:int}")]
        public async Task<IActionResult> UpdateUserChoice(int id, [FromBody] UpdateUserQuestionChoiceDto dto)
        {
            await _examService.UpdateUserChoiceAsync(id, dto);
            return NoContent();
        }

        [HttpGet("get-user-exam-questions/{examId:int}")]
        public async Task<IActionResult> GetUserExamQuestions(int examId)
        {
            if (examId <= 0)
            {
                return BadRequest("Invalid examId");
            }
            try
            {
                var result = await _examService.GetExamQuestionsAsync(examId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

        [HttpGet("get-user-exams/{userId:int}")]
        public async Task<IActionResult> GetUserExams(int userId = 0)
         {
            userId = userId == 0 ? userClaims.GetUserId() : userId;
            if (userId <= 0)
            {
                return BadRequest("Invalid userId");
            }

            var result = await _examService.GetUserExamsAsync(userId);
            return Ok(result);
        }

        [HttpGet("exam-meta-data/{examId:int}")]
        public async Task<IActionResult> GetExamMetaData(int examId)
        {
            if (examId <= 0)
            {
                return BadRequest("Invalid examId");
            }

            var result = await _examService.GetExamMetaData(examId);
            if (result == null)
                return NotFound();

            if(result.UserId != userClaims.GetUserId())
            {
                return new ForbidResult();
            }

            return Ok(result);
        }

        [HttpPut("update-exam-status/{examId:int}")]
        public async Task<IActionResult> UpdateExamStatus(int examId, [FromBody] ExamFeedbackDto feedback)
        {
            if (examId <= 0)
            {
                return BadRequest("Invalid examId");
            }
            try
            {
                await _examService.SaveExamStatus(feedback);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("exam-details/{examId:int}")]
        public async Task<IActionResult> GetExamDetails(int examId)
        {
            var result = await _examService.GetExamDetailsAsync(examId);

            if (result == null)
                return NotFound(new { Message = "Exam not found." });

            return Ok(result);
        }
    }
}
