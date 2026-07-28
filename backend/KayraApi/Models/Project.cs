using System.ComponentModel.DataAnnotations;

namespace KayraApi.Models;

public class Project
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string GalleryJson { get; set; } = "[]";
    public string ProductsJson { get; set; } = "[]";
    public string? Area { get; set; }
    public string? Year { get; set; }
    public string? Client { get; set; }
    public bool IsActive { get; set; } = true;
    public int Order { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
