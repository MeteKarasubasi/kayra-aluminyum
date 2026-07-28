namespace KayraApi.Models;

public class AdminLog
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string AdminId { get; set; } = string.Empty;
    public Admin? Admin { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? Target { get; set; }
    public string? Details { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
