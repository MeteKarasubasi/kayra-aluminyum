using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly KayraDbContext _db;
    public ProjectsController(KayraDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? category)
    {
        var q = _db.Projects.Where(p => p.IsActive);
        if (!string.IsNullOrEmpty(category))
            q = q.Where(p => p.Category == category);
        var items = await q.OrderBy(p => p.Order).ToListAsync();
        return Ok(items.Select(p => new
        {
            p.Id, p.Title, p.Slug, p.Description, p.Location, p.Category,
            p.Image, p.Area, p.Year, p.Client, p.Order,
            gallery = JsonSerializer.Deserialize<List<string>>(p.GalleryJson ?? "[]"),
            products = JsonSerializer.Deserialize<List<string>>(p.ProductsJson ?? "[]")
        }));
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> BySlug(string slug)
    {
        var p = await _db.Projects.FirstOrDefaultAsync(x => x.Slug == slug && x.IsActive);
        if (p is null) return NotFound();
        return Ok(new
        {
            p.Id, p.Title, p.Slug, p.Description, p.Location, p.Category,
            p.Image, p.Area, p.Year, p.Client, p.Order,
            gallery = JsonSerializer.Deserialize<List<string>>(p.GalleryJson ?? "[]"),
            products = JsonSerializer.Deserialize<List<string>>(p.ProductsJson ?? "[]")
        });
    }
}