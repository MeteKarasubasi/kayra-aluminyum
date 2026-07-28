namespace KayraApi.Models;

public class Product
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string TitleTr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? DescTr { get; set; }
    public string? DescEn { get; set; }
    public string Image { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string FeaturesJson { get; set; } = "[]";
    public bool IsActive { get; set; } = true;
    public int Order { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
