// Bilgenly.Application/Services/ClassService.cs
using Bilgenly.Application.DTOs;
using Bilgenly.Application.Interfaces;
using Bilgenly.Domain.Entities;

namespace Bilgenly.Application.Services;

public class ClassService
{
    private readonly IClassRepository _classRepository;
    private readonly IQuizRepository _quizRepository;

    public ClassService(IClassRepository classRepository, IQuizRepository quizRepository)
    {
        _classRepository = classRepository;
        _quizRepository = quizRepository;
    }

    private static string GenerateInviteCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = new Random();
        return new string(Enumerable.Range(0, 6)
            .Select(_ => chars[random.Next(chars.Length)]).ToArray());
    }

    public async Task<ClassDto> CreateClassAsync(CreateClassDto dto, Guid teacherId)
    {
        var classEntity = new Class
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Subject = dto.Subject,
            Description = dto.Description,
            TeacherId = teacherId,
            InviteCode = GenerateInviteCode(),
            IsArchived = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _classRepository.AddAsync(classEntity);
        await _classRepository.SaveChangesAsync();

        return MapToDto(classEntity);
    }

    public async Task<IEnumerable<ClassDto>> GetMyClassesAsTeacherAsync(Guid teacherId)
    {
        var classes = await _classRepository.GetByTeacherIdAsync(teacherId);
        return classes.Select(MapToDto);
    }

    public async Task<IEnumerable<ClassDto>> GetMyClassesAsStudentAsync(Guid studentId)
    {
        var classes = await _classRepository.GetByStudentIdAsync(studentId);
        return classes.Select(MapToDto);
    }

    public async Task<(ClassDto? Result, string? Error)> UpdateClassAsync(
        Guid classId, CreateClassDto dto, Guid teacherId)
    {
        var classEntity = await _classRepository.GetByIdAsync(classId);
        if (classEntity is null) return (null, "Class not found");
        if (classEntity.TeacherId != teacherId) return (null, "Access denied");

        classEntity.Name = dto.Name;
        classEntity.Subject = dto.Subject;
        classEntity.Description = dto.Description;
        classEntity.UpdatedAt = DateTime.UtcNow;

        await _classRepository.SaveChangesAsync();
        return (MapToDto(classEntity), null);
    }

    public async Task<(bool Success, string? Error)> ArchiveClassAsync(
        Guid classId, Guid teacherId)
    {
        var classEntity = await _classRepository.GetByIdAsync(classId);
        if (classEntity is null) return (false, "Class not found");
        if (classEntity.TeacherId != teacherId) return (false, "Access denied");

        classEntity.IsArchived = !classEntity.IsArchived;
        classEntity.UpdatedAt = DateTime.UtcNow;

        await _classRepository.SaveChangesAsync();
        return (true, null);
    }

    public async Task<(bool Success, string? Error)> DeleteClassAsync(
        Guid classId, Guid teacherId)
    {
        var classEntity = await _classRepository.GetByIdAsync(classId);
        if (classEntity is null) return (false, "Class not found");
        if (classEntity.TeacherId != teacherId) return (false, "Access denied");

        _classRepository.Remove(classEntity);
        await _classRepository.SaveChangesAsync();
        return (true, null);
    }

    public async Task<(ClassDto? Result, string? Error)> JoinClassAsync(
        string inviteCode, Guid studentId)
    {
        var classEntity = await _classRepository.GetByInviteCodeAsync(inviteCode);
        if (classEntity is null) return (null, "Invalid invite code");
        if (classEntity.IsArchived) return (null, "Class is archived");

        var alreadyJoined = classEntity.ClassStudents
            .Any(cs => cs.StudentId == studentId);
        if (alreadyJoined) return (null, "Already joined this class");

        classEntity.ClassStudents.Add(new ClassStudent
        {
            ClassId = classEntity.Id,
            StudentId = studentId,
            JoinedAt = DateTime.UtcNow
        });
        classEntity.UpdatedAt = DateTime.UtcNow;

        await _classRepository.SaveChangesAsync();
        return (MapToDto(classEntity), null);
    }

    public async Task<(ClassDto? Result, string? Error)> AssignQuizAsync(
        Guid classId, Guid quizId, Guid teacherId)
    {
        var classEntity = await _classRepository.GetByIdAsync(classId);
        if (classEntity is null) return (null, "Class not found");
        if (classEntity.TeacherId != teacherId) return (null, "Access denied");

        var quiz = await _quizRepository.GetByIdAsync(quizId);
        if (quiz is null) return (null, "Quiz not found");

        var alreadyAssigned = classEntity.ClassQuizzes
            .Any(cq => cq.QuizId == quizId);
        if (alreadyAssigned) return (null, "Quiz already assigned");

        classEntity.ClassQuizzes.Add(new ClassQuiz
        {
            ClassId = classId,
            QuizId = quizId,
            AssignedAt = DateTime.UtcNow
        });
        classEntity.UpdatedAt = DateTime.UtcNow;

        await _classRepository.SaveChangesAsync();
        return (MapToDto(classEntity), null);
    }

    private ClassDto MapToDto(Class c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Subject = c.Subject,
        Description = c.Description,
        InviteCode = c.InviteCode,
        IsArchived = c.IsArchived,
        StudentCount = c.ClassStudents.Count,
        QuizCount = c.ClassQuizzes.Count,
        CreatedAt = c.CreatedAt,
        UpdatedAt = c.UpdatedAt,
        Students = c.ClassStudents.Select(cs => new ClassStudentDto
        {
            StudentId = cs.StudentId,
            Username = cs.Student?.Username ?? "",
            Email = cs.Student?.Email ?? "",
            JoinedAt = cs.JoinedAt
        }).ToList(),
        Quizzes = c.ClassQuizzes.Select(cq => new ClassQuizDto
        {
            QuizId = cq.QuizId,
            QuizTitle = cq.Quiz?.Title ?? "",
            AssignedAt = cq.AssignedAt
        }).ToList()
    };
}