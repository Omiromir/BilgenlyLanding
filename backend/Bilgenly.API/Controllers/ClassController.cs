using Bilgenly.Application.DTOs;
using Bilgenly.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bilgenly.API.Controllers;

[ApiController]
[Route("api/classes")]
[Authorize]
public class ClassController : ControllerBase
{
    private readonly ClassService _classService;

    public ClassController(ClassService classService)
    {
        _classService = classService;
    }

    [HttpPost]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> CreateClass(CreateClassDto dto)
    {
        var teacherId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var result = await _classService.CreateClassAsync(dto, teacherId);
        return Ok(result);
    }

    [HttpGet("teacher")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GetMyClassesAsTeacher()
    {
        var teacherId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var result = await _classService.GetMyClassesAsTeacherAsync(teacherId);
        return Ok(result);
    }

    [HttpGet("student")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMyClassesAsStudent()
    {
        var studentId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var result = await _classService.GetMyClassesAsStudentAsync(studentId);
        return Ok(result);
    }

    [HttpPut("{classId}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> UpdateClass(Guid classId, CreateClassDto dto)
    {
        var teacherId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var (result, error) = await _classService.UpdateClassAsync(classId, dto, teacherId);
        if (result is null) return BadRequest(new { message = error });
        return Ok(result);
    }

    [HttpPatch("{classId}/archive")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> ArchiveClass(Guid classId)
    {
        var teacherId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var (success, error) = await _classService.ArchiveClassAsync(classId, teacherId);
        if (!success) return BadRequest(new { message = error });
        return Ok(new { message = "Class archive status updated" });
    }

    [HttpDelete("{classId}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> DeleteClass(Guid classId)
    {
        var teacherId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var (success, error) = await _classService.DeleteClassAsync(classId, teacherId);
        if (!success) return BadRequest(new { message = error });
        return Ok(new { message = "Class deleted" });
    }

    [HttpPost("join")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> JoinClass([FromBody] JoinClassDto dto)
    {
        var studentId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var (result, error) = await _classService.JoinClassAsync(dto.InviteCode, studentId);
        if (result is null) return BadRequest(new { message = error });
        return Ok(result);
    }

    [HttpPost("{classId}/quizzes")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> AssignQuiz(Guid classId, [FromBody] AssignQuizDto dto)
    {
        var teacherId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var (result, error) = await _classService.AssignQuizAsync(classId, dto.QuizId, teacherId);
        if (result is null) return BadRequest(new { message = error });
        return Ok(result);
    }
}

public class JoinClassDto
{
    public string InviteCode { get; set; } = string.Empty;
}

public class AssignQuizDto
{
    public Guid QuizId { get; set; }
}