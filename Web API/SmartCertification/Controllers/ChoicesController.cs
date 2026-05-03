using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartCertification.Application.DTOs;
using SmartCertification.Application.Interfaces.QuestionsChoice;

namespace SmartCertification.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChoicesController : ControllerBase
    {
        private readonly IChoiceService _service;

        public ChoicesController(IChoiceService service)
        {
            _service = service;
        }

        [HttpGet("{questionId:int}")]
        public async Task<ActionResult<IEnumerable<ChoiceDto>>> GetChoices(int questionId)
        {
            return Ok(await _service.GetAllChoicesAsync(questionId));
        }

        [HttpGet("{questionId:int}/{id:int}")]
        public async Task<ActionResult<ChoiceDto>> GetChoice(int questionId, int id)
        {
           var choice = await _service.GetChoiceByIdAsync(id);
            return choice == null ? NotFound(): Ok(choice);
        }

        [HttpPost]
        public async Task<IActionResult> CreateChoice([FromBody] CreateChoiceDto dto)
        {
            await _service.AddChoiceAsync(dto);
            return Created();
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateChoice(int id,  [FromBody] UpdateChoiceDto dto)
        {
            await _service.UpdateChoiceAsync(id, dto);
            return NoContent();
        }

        [HttpPatch("{id:int}")]
        public async Task<IActionResult> UpdateUserChoice(int id, [FromBody] UpdateUserChoice dto)
        {
            await _service.UpdateUserChoiceAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteChoice(int id)
        {
            await _service.DeleteChoiceAsync(id);
            return NoContent();
        }
    }
}
