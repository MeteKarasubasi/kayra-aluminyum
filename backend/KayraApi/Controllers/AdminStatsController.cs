using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/admin/stats")]
[Authorize]
public class AdminStatsController : ControllerBase
{
    private readonly KayraDbContext _db;
    public AdminStatsController(KayraDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var now = DateTime.UtcNow;
        var last30 = now.AddDays(-30);

        var projects = await _db.Projects.CountAsync();
        var products = await _db.Products.CountAsync();
        var references = await _db.References.CountAsync();
        var messages = await _db.ContactMessages.CountAsync();
        var unreadMessages = await _db.ContactMessages.CountAsync(m => !m.IsRead);
        var visits = await _db.PageVisits.CountAsync();
        var visits30 = await _db.PageVisits.CountAsync(v => v.CreatedAt >= last30);
        var admins = await _db.Admins.CountAsync();

        return Ok(new
        {
            projects, products, references, messages, unreadMessages,
            visits, visits30, admins,
            recentMessages = await _db.ContactMessages
                .OrderByDescending(m => m.CreatedAt).Take(5)
                .Select(m => new { m.Id, m.Name, m.Email, m.IsRead, m.CreatedAt })
                .ToListAsync()
        });
    }
}