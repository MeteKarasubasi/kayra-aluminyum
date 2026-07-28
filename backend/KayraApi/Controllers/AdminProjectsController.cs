using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;
using KayraApi.Models;
using KayraApi.Services;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/admin/projects")]
[Authorize]
public class AdminProjectsController : ControllerBase
{
    private readonly KayraDbContext _db;
    public AdminProjectsController(KayraDbContext db) => _db = db;

    private string AdminId => User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "";

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var items = await _db.Projects.OrderBy(p => p.Order).ToListAsync();
        return Ok(items.Select(Serialize));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var p = await _db.Projects.FindAsync(id);
        if (p is null) return NotFound();
        return Ok(Serialize(p));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProjectInput dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Slug))
            return BadRequest(new { error = "Title ve Slug zorunludur." });
        if (await _db.Projects.AnyAsync(p => p.Slug == dto.Slug))
            return BadRequest(new { error = "Bu slug zaten kullanımda." });

        var p = new Project
        {
            Title = dto.Title, Slug = dto.Slug, Description = dto.Description,
            Location = dto.Location ?? "", Category = dto.Category ?? "residential",
            Image = dto.Image ?? "", GalleryJson = ToJson(dto.Gallery),
            ProductsJson = ToJson(dto.Products), Area = dto.Area, Year = dto.Year,
            Client = dto.Client, IsActive = dto.IsActive ?? true, Order = dto.Order ?? 0
        };
        _db.Projects.Add(p);
        await _db.SaveChangesAsync();
        await AuditLogger.LogAsync(_db, AdminId, "project.create", p.Id, p.Title);
        return Ok(Serialize(p));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ProjectInput dto)
    {
        var p = await _db.Projects.FindAsync(id);
        if (p is null) return NotFound();
        if (!string.IsNullOrWhiteSpace(dto.Slug) && dto.Slug != p.Slug
            && await _db.Projects.AnyAsync(x => x.Slug == dto.Slug))
            return BadRequest(new { error = "Bu slug zaten kullanımda." });

        p.Title = dto.Title ?? p.Title; p.Slug = dto.Slug ?? p.Slug;
        p.Description = dto.Description; p.Location = dto.Location ?? p.Location;
        p.Category = dto.Category ?? p.Category; p.Image = dto.Image ?? p.Image;
        if (dto.Gallery != null) p.GalleryJson = ToJson(dto.Gallery);
        if (dto.Products != null) p.ProductsJson = ToJson(dto.Products);
        p.Area = dto.Area; p.Year = dto.Year; p.Client = dto.Client;
        if (dto.IsActive.HasValue) p.IsActive = dto.IsActive.Value;
        if (dto.Order.HasValue) p.Order = dto.Order.Value;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await AuditLogger.LogAsync(_db, AdminId, "project.update", p.Id, p.Title);
        return Ok(Serialize(p));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var p = await _db.Projects.FindAsync(id);
        if (p is null) return NotFound();
        _db.Projects.Remove(p);
        await _db.SaveChangesAsync();
        await AuditLogger.LogAsync(_db, AdminId, "project.delete", p.Id, p.Title);
        return NoContent();
    }

    static string ToJson(List<string>? arr) => JsonSerializer.Serialize(arr ?? new List<string>());
    static object Serialize(Project p) => new
    {
        p.Id, p.Title, p.Slug, p.Description, p.Location, p.Category, p.Image,
        p.Area, p.Year, p.Client, p.IsActive, p.Order, p.CreatedAt, p.UpdatedAt,
        gallery = JsonSerializer.Deserialize<List<string>>(p.GalleryJson ?? "[]"),
        products = JsonSerializer.Deserialize<List<string>>(p.ProductsJson ?? "[]")
    };
}

public class ProjectInput
{
    public string? Title { get; set; }
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public string? Category { get; set; }
    public string? Image { get; set; }
    public List<string>? Gallery { get; set; }
    public List<string>? Products { get; set; }
    public string? Area { get; set; }
    public string? Year { get; set; }
    public string? Client { get; set; }
    public bool? IsActive { get; set; }
    public int? Order { get; set; }
}