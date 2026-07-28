using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;
using KayraApi.Models;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/admin/settings")]
[Authorize]
public class AdminSettingsController : ControllerBase
{
    private readonly KayraDbContext _db;
    public AdminSettingsController(KayraDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var settings = await _db.SiteSettings.ToDictionaryAsync(s => s.Key, s => s.Value);
        return Ok(settings);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] Dictionary<string, string> payload)
    {
        if (payload is null || payload.Count == 0)
            return BadRequest(new { error = "Güncellenecek ayar yok." });

        var existing = await _db.SiteSettings.ToListAsync();
        var map = existing.ToDictionary(s => s.Key);
        foreach (var kv in payload)
        {
            if (map.TryGetValue(kv.Key, out var s)) s.Value = kv.Value ?? "";
            else _db.SiteSettings.Add(new SiteSetting { Key = kv.Key, Value = kv.Value ?? "" });
        }
        await _db.SaveChangesAsync();
        return Ok(await _db.SiteSettings.ToDictionaryAsync(s => s.Key, s => s.Value));
    }
}