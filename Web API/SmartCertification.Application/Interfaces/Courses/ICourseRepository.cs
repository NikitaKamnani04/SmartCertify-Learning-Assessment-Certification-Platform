using SmartCertification.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartCertification.Application.Interfaces.Courses
{
    public interface ICourseRepository
    {
        //IEnumerable<Course> GetAllCourses();
        Task<IEnumerable<Course>> GetAllCoursesAsync();
        Task<Course?> GetCourseByIdAsync(int courseId);
        Task<bool> IsTitleDuplicateAsync(string title);
        Task AddCourseAsync(Course course);
        Task UpdateCourseAsync(Course course);
        Task DeleteCourseAsync(Course course);
        Task UpdateDescriptionAsync(int courseId, string description);
    }
}
