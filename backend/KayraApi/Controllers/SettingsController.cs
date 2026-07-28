using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/settings")]
public class SettingsController : ControllerBase
{
    private readonly KayraDbContext _db;
    public SettingsController(KayraDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var settings = await _db.SiteSettings
            .ToDictionaryAsync(s => s.Key, s => s.Value);
        return Ok(settings);
    }
}