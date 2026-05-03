using SmartCertification.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartCertification.Application.Interfaces.QuestionsChoice
{
    public interface IQuestionService
    {
        Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync();
        Task<QuestionDto?> GetQuestionByIdAsync(int id);
        Task AddQuestionAsync(CreateQuestionDto dto);
        Task UpdateQuestionAsync(int id, UpdateQuestionDto dto);
        Task DeleteQuestionAsync(int id);
        Task<QuestionDto> AddQuestionAndChoicesAsync(QuestionDto dto);
        Task UpdateQuestionAndChoicesAsync(int id, QuestionDto dto);
        Task<List<QuestionDto>> GetQuestionsByCourseIdAsync(int courseId);
    }
}
