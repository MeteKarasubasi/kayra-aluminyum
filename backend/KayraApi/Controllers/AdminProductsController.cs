using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;
using KayraApi.Models;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/admin/products")]
[Authorize]
public class AdminProductsController : ControllerBase
{
    private readonly KayraDbContext _db;
    public AdminProductsController(KayraDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var items = await _db.Products.OrderBy(p => p.Order).ToListAsync();
        return Ok(items.Select(Serialize));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var p = await _db.Products.FindAsync(id);
        if (p is null) return NotFound();
        return Ok(Serialize(p));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductInput dto)
    {
        if (string.IsNullOrWhiteSpace(dto.TitleTr) || string.IsNullOrWhiteSpace(dto.Slug))
            return BadRequest(new { error = "TitleTr ve Slug zorunludur." });
        if (await _db.Products.AnyAsync(p => p.Slug == dto.Slug))
            return BadRequest(new { error = "Bu slug zaten kullanımda." });

        var p = new Product
        {
            TitleTr = dto.TitleTr, TitleEn = dto.TitleEn ?? dto.TitleTr, Slug = dto.Slug,
            DescTr = dto.DescTr, DescEn = dto.DescEn, Image = dto.Image ?? "",
            Code = dto.Code ?? "", FeaturesJson = ToJson(dto.Features),
            IsActive = dto.IsActive ?? true, Order = dto.Order ?? 0
        };
        _db.Products.Add(p);
        await _db.SaveChangesAsync();
        return Ok(Serialize(p));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ProductInput dto)
    {
        var p = await _db.Products.FindAsync(id);
        if (p is null) return NotFound();
        if (!string.IsNullOrWhiteSpace(dto.Slug) && dto.Slug != p.Slug
            && await _db.Products.AnyAsync(x => x.Slug == dto.Slug))
            return BadRequest(new { error = "Bu slug zaten kullanımda." });

        p.TitleTr = dto.TitleTr ?? p.TitleTr; p.TitleEn = dto.TitleEn ?? p.TitleEn;
        p.Slug = dto.Slug ?? p.Slug; p.DescTr = dto.DescTr; p.DescEn = dto.DescEn;
        p.Image = dto.Image ?? p.Image; p.Code = dto.Code ?? p.Code;
        if (dto.Features != null) p.FeaturesJson = ToJson(dto.Features);
        if (dto.IsActive.HasValue) p.IsActive = dto.IsActive.Value;
        if (dto.Order.HasValue) p.Order = dto.Order.Value;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(Serialize(p));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var p = await _db.Products.FindAsync(id);
        if (p is null) return NotFound();
        _db.Products.Remove(p);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    static string ToJson(List<string>? arr) => JsonSerializer.Serialize(arr ?? new List<string>());
    static object Serialize(Product p) => new
    {
        p.Id, p.TitleTr, p.TitleEn, p.Slug, p.DescTr, p.DescEn, p.Image,
        p.Code, p.IsActive, p.Order, p.CreatedAt, p.UpdatedAt,
        features = JsonSerializer.Deserialize<List<string>>(p.FeaturesJson ?? "[]")
    };
}

public class ProductInput
{
    public string? TitleTr { get; set; }
    public string? TitleEn { get; set; }
    public string? Slug { get; set; }
    public string? DescTr { get; set; }
    public string? DescEn { get; set; }
    public string? Image { get; set; }
    public string? Code { get; set; }
    public List<string>? Features { get; set; }
    public bool? IsActive { get; set; }
    public int? Order { get; set; }
}