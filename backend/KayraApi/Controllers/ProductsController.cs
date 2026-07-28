using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;
using KayraApi.Models;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly KayraDbContext _db;
    public ProductsController(KayraDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var items = await _db.Products
            .Where(p => p.IsActive)
            .OrderBy(p => p.Order)
            .Select(p => new
            {
                p.Id, p.TitleTr, p.TitleEn, p.Slug, p.DescTr, p.DescEn,
                p.Image, p.Code, p.FeaturesJson, p.Order
            })
            .ToListAsync();
        return Ok(items.Select(p => new
        {
            p.Id, p.TitleTr, p.TitleEn, p.Slug, p.DescTr, p.DescEn,
            p.Image, p.Code,
            features = JsonSerializer.Deserialize<List<string>>(p.FeaturesJson ?? "[]"),
            p.Order
        }));
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> BySlug(string slug)
    {
        var p = await _db.Products.FirstOrDefaultAsync(x => x.Slug == slug && x.IsActive);
        if (p is null) return NotFound();
        return Ok(new
        {
            p.Id, p.TitleTr, p.TitleEn, p.Slug, p.DescTr, p.DescEn,
            p.Image, p.Code,
            features = JsonSerializer.Deserialize<List<string>>(p.FeaturesJson ?? "[]"),
            p.Order
        });
    }
}