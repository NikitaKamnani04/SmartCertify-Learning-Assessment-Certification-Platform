using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SmartCertification.Application.DTOs;
using SmartCertification.Application.Interfaces.QuestionsChoice;
using SmartCertification.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartCertification.Infrastructure
{
    public class QuestionRepository : IQuestionRepository
    {
        private readonly SmartCertifyContext _context;
        private readonly IMapper mapper;
        public QuestionRepository(SmartCertifyContext context, IMapper mapper)
        {
            _context = context;
            this.mapper = mapper;
        }
        public async Task<Question> AddQuestionAsync(Question question)
        {
            if (question == null)
                throw new ArgumentNullException(nameof(question));
            await _context.Questions.AddAsync(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public Task DeleteQuestionAsync(Question question)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Question>> GetAllQuestionsAsync()
        {
            return await _context.Questions.Include(q => q.Choices).ToListAsync();
        }

        public async Task<Question?> GetQuestionByIdAsync(int id)
        {
            return await _context.Questions.Include(q => q.Choices).FirstOrDefaultAsync(q => q.QuestionId == id);
        }



        //public async Task UpdateQuestionAndChoicesAsync(int id, QuestionDto dto)
        //{
        //    var question = await GetQuestionByIdAsync(id);

        //    if (question == null)
        //        throw new KeyNotFoundException("Question not found");

        //    // Update question fields
        //    mapper.Map(dto, question);

        //    // STEP 1: Remove deleted choices
        //    var incomingChoiceIds = dto.Choices.Select(c => c.ChoiceId).ToList();

        //    var choicesToDelete = question.Choices
        //        .Where(c => !incomingChoiceIds.Contains(c.ChoiceId))
        //        .ToList();

        //    foreach (var choice in choicesToDelete)
        //    {
        //        _context.Choices.Remove(choice);
        //    }

        //    // STEP 2: Update or Add
        //    foreach (var choiceDto in dto.Choices)
        //    {
        //        var existingChoice = question.Choices
        //            .FirstOrDefault(c => c.ChoiceId == choiceDto.ChoiceId);

        //        if (existingChoice != null)
        //        {
        //            // Update existing
        //            mapper.Map(choiceDto, existingChoice);
        //        }
        //        else
        //        {
        //            // Add new
        //            var newChoice = mapper.Map<Choice>(choiceDto);

        //            // 🔥 VERY IMPORTANT FIX
        //            newChoice.QuestionId = question.QuestionId;

        //            question.Choices.Add(newChoice);
        //        }
        //    }

        //    // ✅ FINAL SAVE (NO Update())
        //    await _context.SaveChangesAsync();
        //} 

        public async Task UpdateQuestionAndChoicesAsync(int id, QuestionDto dto)
        {
            var question = await _context.Questions
                .Include(q => q.Choices)
                .FirstOrDefaultAsync(q => q.QuestionId == id);

            if (question == null)
                throw new KeyNotFoundException("Question not found");

            mapper.Map(dto, question);

            var incomingIds = dto.Choices
                .Where(c => c.ChoiceId != 0)
                .Select(c => c.ChoiceId)
                .ToList();

            var toRemove = question.Choices
                .Where(c => !incomingIds.Contains(c.ChoiceId))
                .ToList();

            foreach (var choice in toRemove)
            {
                _context.Choices.Remove(choice);
            }

            foreach (var choiceDto in dto.Choices)
            {
                if (choiceDto.ChoiceId != 0)
                {
                    var existing = question.Choices
                        .FirstOrDefault(c => c.ChoiceId == choiceDto.ChoiceId);

                    if (existing != null)
                        mapper.Map(choiceDto, existing);
                }
                else
                {
                    var newChoice = mapper.Map<Choice>(choiceDto);

                    // 🔥 MUST
                    newChoice.QuestionId = question.QuestionId;

                    _context.Choices.Add(newChoice);
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task UpdateQuestionAsync(Question question)
        {
            //_context.Questions.Update(question);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Choice>> GetChoicesByQuestionIdAsync(int questionId)
        {
            return await _context.Choices
                .Where(c => c.QuestionId == questionId)
                .ToListAsync();
        }

        public async Task<List<Question>> GetQuestionsByCourseIdAsync(int courseId)
        {
            return await _context.Questions
                .Include(q => q.Choices) // important
                .Where(q => q.CourseId == courseId)
                .ToListAsync();
        }

    }
}
