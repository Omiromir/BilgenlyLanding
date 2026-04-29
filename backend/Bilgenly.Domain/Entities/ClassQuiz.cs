namespace Bilgenly.Domain.Entities;

public class ClassQuiz
{
    public Guid ClassId { get; set; }
    public Class Class { get; set; } = null!;
    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; } = null!;
    public DateTime AssignedAt { get; set; }
}