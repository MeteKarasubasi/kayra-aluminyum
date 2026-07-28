using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;
using KayraApi.Models;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/admin/messages")]
[Authorize]
public class AdminMessagesController : ControllerBase
{
    private readonly KayraDbContext _db;
    public AdminMessagesController(KayraDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] bool? unread, [FromQuery] int limit = 100)
    {
        var q = _db.ContactMessages.AsQueryable();
        if (unread == true) q = q.Where(m => !m.IsRead);
        var items = await q.OrderByDescending(m => m.CreatedAt).Take(limit).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var m = await _db.ContactMessages.FindAsync(id);
        if (m is null) return NotFound();
        return Ok(m);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Patch(string id, [FromBody] MessagePatch dto)
    {
        var m = await _db.ContactMessages.FindAsync(id);
        if (m is null) return NotFound();
        if (dto.IsRead.HasValue) m.IsRead = dto.IsRead.Value;
        if (dto.IsSpam.HasValue) m.IsSpam = dto.IsSpam.Value;
        await _db.SaveChangesAsync();
        return Ok(m);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var m = await _db.ContactMessages.FindAsync(id);
        if (m is null) return NotFound();
        _db.ContactMessages.Remove(m);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public class MessagePatch
{
    public bool? IsRead { get; set; }
    public bool? IsSpam { get; set; }
}