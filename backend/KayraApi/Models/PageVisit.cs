namespace KayraApi.Models;

public class PageVisit
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Path { get; set; } = string.Empty;
    public string? Ip { get; set; }
    public string? UserAgent { get; set; }
    public string? Referrer { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Language { get; set; }
    public string? Device { get; set; }
    public string? Browser { get; set; }
    public bool IsBot { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
