using SmartCertification.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartCertification.Application.Interfaces.QuestionsChoice
{
    public interface IChoiceRepository
    {
        Task<IEnumerable<Choice>> GetAllChoicesAsync(int questionId);
        Task<Choice?> GetChoiceByIdAsync(int id);
        Task AddChoiceAsync(Choice choice);
        Task UpdateChoiceAsync(Choice choice);
        Task DeleteChoiceAsync(Choice choice);
    }
}

