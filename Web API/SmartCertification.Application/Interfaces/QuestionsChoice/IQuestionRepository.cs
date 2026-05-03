using SmartCertification.Application.DTOs;
using SmartCertification.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartCertification.Application.Interfaces.QuestionsChoice
{
    public interface IQuestionRepository
    {
        Task<IEnumerable<Question>> GetAllQuestionsAsync();
        Task<Question?> GetQuestionByIdAsync(int id);
        Task<Question> AddQuestionAsync(Question question);
        Task UpdateQuestionAsync(Question question);
        Task DeleteQuestionAsync(Question question);
        Task UpdateQuestionAndChoicesAsync(int id, QuestionDto dto);
        Task<List<Question>> GetQuestionsByCourseIdAsync(int courseId);
    }
}
