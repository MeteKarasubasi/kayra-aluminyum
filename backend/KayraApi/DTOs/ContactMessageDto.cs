namespace KayraApi.DTOs;

public class ContactMessageDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? System { get; set; }
    public string? Language { get; set; }
}