using AutoMapper;
using SmartCertification.Application.DTOs;
using SmartCertification.Application.Interfaces.Certification;
using SmartCertification.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartCertification.Application.Services.Certification
{
    public class ExamService : IExamService
    {
        private readonly IExamRepository _examRepository;
        private readonly IMapper mapper;

        public ExamService(IExamRepository examRepository, IMapper mapper)
        {
            _examRepository = examRepository;
            this.mapper = mapper;
        }
        public async Task<ExamResponseDto> GetExamDetailsAsync(int examId)
        {
            return await _examRepository.GetExamDetailsAsync(examId);
        }
            
        public Task<ExamDto?> GetExamMetaData(int examId)
        {
            return _examRepository.GetExamMetaDataAsync(examId);
        }

        public async Task<List<UserExamQuestionsDto>> GetExamQuestionsAsync(int examId)
        {
            var examQuestions = await _examRepository.GetExamQuestionsAsync(examId);
            return examQuestions != null
                ? mapper.Map<List<UserExamQuestionsDto>>(examQuestions)
                : new List<UserExamQuestionsDto>();
        }

        public async Task<List<UserExam>> GetUserExamsAsync(int userId)
        {
            return await _examRepository.GetUserExamsAsync(userId);
        }

        public async Task SaveExamStatus(ExamFeedbackDto examFeedback)
        {
            await _examRepository.SaveExamStatusAsync(examFeedback.ExamId, examFeedback.Feedback.ToString());
        }

        public async Task<ExamDto> StartExamAsync(int courseId, int userId)
        {
            var questions = await _examRepository.GetRandomQuestionsAsync(courseId, 10);

            if(!questions.Any())
            {
                throw new Exception("No questions found for the specified course.");
            }

            var exam = new Exam
            {
                CourseId = courseId,
                UserId = userId,
                Status = "In Progress",
                StartedOn = DateTime.Now,
            };

            await _examRepository.CreateExamWithQuestionsAsync(exam, questions);

            return new ExamDto
            {
                ExamId = exam.ExamId,
                CourseId = exam.CourseId,
                UserId = userId,
                Status = exam.Status,
                StartedOn = exam.StartedOn,
                QuestionIds = questions.Select(q => q.QuestionId).ToList()
            };
        }

        public async Task UpdateUserChoiceAsync(int id, UpdateUserQuestionChoiceDto dto)
        {
            var examQuestion = await _examRepository.GetExamQuestionAsync(dto.ExamId, dto.ExamQuestionId);
            if (examQuestion == null)
                throw new KeyNotFoundException($"Exam ID {dto.ExamId} with ExamQuestionId {dto.ExamQuestionId} not found.");

            mapper.Map(dto, examQuestion);
            await _examRepository.UpdateExamQuestionAsync(examQuestion);
        }
    }
}
