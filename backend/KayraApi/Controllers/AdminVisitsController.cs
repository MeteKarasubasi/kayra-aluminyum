using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/admin/visits")]
[Authorize]
public class AdminVisitsController : ControllerBase
{
    private readonly KayraDbContext _db;
    public AdminVisitsController(KayraDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] int limit = 100, [FromQuery] int days = 30, [FromQuery] int offset = 0)
    {
        var since = DateTime.UtcNow.AddDays(-days);
        var q = _db.PageVisits
            .Where(v => v.CreatedAt >= since)
            .OrderByDescending(v => v.CreatedAt);
        var total = await q.CountAsync();
        var items = await q.Skip(offset).Take(limit)
            .Select(v => new
            {
                v.Id, v.Path, v.Ip, v.UserAgent, v.Referrer,
                v.Country, v.City, v.Language, v.Device, v.Browser, v.IsBot, v.CreatedAt
            })
            .ToListAsync();
        return Ok(new { total, items });
    }

    [HttpGet("stats")]
    public async Task<IActionResult> Stats([FromQuery] int days = 30)
    {
        var since = DateTime.UtcNow.AddDays(-days);
        var q = _db.PageVisits.Where(v => v.CreatedAt >= since);

        var byDayRaw = await q.GroupBy(v => v.CreatedAt.Date)
            .Select(g => new { date = g.Key, count = g.Count() })
            .OrderBy(x => x.date).ToListAsync();
        var byDay = byDayRaw.Select(x => new { date = x.date.ToString("yyyy-MM-dd"), x.count }).ToList();

        var byPath = await q.GroupBy(v => v.Path)
            .Select(g => new { path = g.Key, count = g.Count() })
            .OrderByDescending(x => x.count).Take(10).ToListAsync();

        var byDevice = await q.GroupBy(v => v.Device)
            .Select(g => new { device = g.Key ?? "unknown", count = g.Count() })
            .OrderByDescending(x => x.count).ToListAsync();

        var byBrowser = await q.GroupBy(v => v.Browser)
            .Select(g => new { browser = g.Key ?? "other", count = g.Count() })
            .OrderByDescending(x => x.count).ToListAsync();

        var total = await q.CountAsync();
        var bots = await q.CountAsync(v => v.IsBot);

        return Ok(new { total, bots, byDay, byPath, byDevice, byBrowser });
    }
}