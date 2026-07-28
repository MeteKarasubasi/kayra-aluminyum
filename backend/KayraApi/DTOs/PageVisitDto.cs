namespace KayraApi.DTOs;

public class PageVisitDto
{
    public string Path { get; set; } = string.Empty;
    public string? Referrer { get; set; }
    public string? Language { get; set; }
}