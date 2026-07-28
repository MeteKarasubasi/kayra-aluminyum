namespace KayraApi.Models;

public class ContactMessage
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? System { get; set; }
    public string? Ip { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Language { get; set; }
    public bool IsRead { get; set; } = false;
    public bool IsSpam { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
