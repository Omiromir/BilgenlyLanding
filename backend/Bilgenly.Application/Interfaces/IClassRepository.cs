using Bilgenly.Domain.Entities;
namespace Bilgenly.Application.Interfaces;

public interface IClassRepository
{
    Task<Class?> GetByIdAsync(Guid id);
    Task<Class?> GetByInviteCodeAsync(string inviteCode);
    Task<IEnumerable<Class>> GetByTeacherIdAsync(Guid teacherId);
    Task<IEnumerable<Class>> GetByStudentIdAsync(Guid studentId);
    Task AddAsync(Class classEntity);
    Task SaveChangesAsync();
    void Remove(Class classEntity);
}