using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;
using KayraApi.Models;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/admin/references")]
[Authorize]
public class AdminReferencesController : ControllerBase
{
    private readonly KayraDbContext _db;
    public AdminReferencesController(KayraDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var items = await _db.References.OrderBy(r => r.Order).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var r = await _db.References.FindAsync(id);
        if (r is null) return NotFound();
        return Ok(r);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ReferenceInput dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { error = "Name zorunludur." });
        var r = new Reference
        {
            Name = dto.Name, Logo = dto.Logo ?? "", Website = dto.Website,
            IsActive = dto.IsActive ?? true, Order = dto.Order ?? 0
        };
        _db.References.Add(r);
        await _db.SaveChangesAsync();
        return Ok(r);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ReferenceInput dto)
    {
        var r = await _db.References.FindAsync(id);
        if (r is null) return NotFound();
        r.Name = dto.Name ?? r.Name; r.Logo = dto.Logo ?? r.Logo;
        r.Website = dto.Website; if (dto.IsActive.HasValue) r.IsActive = dto.IsActive.Value;
        if (dto.Order.HasValue) r.Order = dto.Order.Value;
        r.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(r);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var r = await _db.References.FindAsync(id);
        if (r is null) return NotFound();
        _db.References.Remove(r);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public class ReferenceInput
{
    public string? Name { get; set; }
    public string? Logo { get; set; }
    public string? Website { get; set; }
    public bool? IsActive { get; set; }
    public int? Order { get; set; }
}