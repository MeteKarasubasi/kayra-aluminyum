using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/references")]
public class ReferencesController : ControllerBase
{
    private readonly KayraDbContext _db;
    public ReferencesController(KayraDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var items = await _db.References
            .Where(r => r.IsActive)
            .OrderBy(r => r.Order)
            .Select(r => new { r.Id, r.Name, r.Logo, r.Website, r.Order })
            .ToListAsync();
        return Ok(items);
    }
}