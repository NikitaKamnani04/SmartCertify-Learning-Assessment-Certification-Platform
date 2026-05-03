using SmartCertification.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartCertification.Application.Interfaces.Certification
{
    public interface IExamService
    {
        Task<ExamDto> StartExamAsync(int courseId, int userId);
        Task UpdateUserChoiceAsync(int id, UpdateUserQuestionChoiceDto dto);
        Task<List<UserExamQuestionsDto>> GetExamQuestionsAsync(int examId);
        Task<List<UserExam>> GetUserExamsAsync(int userId);

        Task<ExamDto?> GetExamMetaData(int examId);
        Task SaveExamStatus(ExamFeedbackDto examFeedback);

        Task<ExamResponseDto> GetExamDetailsAsync(int examId);
    }
}
