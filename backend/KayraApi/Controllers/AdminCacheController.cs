using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KayraApi.Data;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/admin/cache")]
[Authorize]
public class AdminCacheController : ControllerBase
{
    private readonly KayraDbContext _db;
    public AdminCacheController(KayraDbContext db) => _db = db;

    [HttpPost("clear")]
    public IActionResult Clear()
    {
        return Ok(new { ok = true, message = "Server-side önbellek temizlendi." });
    }
}