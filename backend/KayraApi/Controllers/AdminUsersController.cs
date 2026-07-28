using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;
using KayraApi.Models;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize]
public class AdminUsersController : ControllerBase
{
    private readonly KayraDbContext _db;
    public AdminUsersController(KayraDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var items = await _db.Admins
            .Select(a => new { a.Id, a.Email, a.Name, a.Role, a.CreatedAt, a.UpdatedAt })
            .OrderBy(a => a.Email).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var a = await _db.Admins.Where(x => x.Id == id)
            .Select(a => new { a.Id, a.Email, a.Name, a.Role, a.CreatedAt, a.UpdatedAt })
            .FirstOrDefaultAsync();
        if (a is null) return NotFound();
        return Ok(a);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserInput dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { error = "Email ve Password zorunludur." });
        if (await _db.Admins.AnyAsync(a => a.Email == dto.Email))
            return BadRequest(new { error = "Bu e-posta zaten kullanımda." });

        var a = new Admin
        {
            Email = dto.Email.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, workFactor: 12),
            Name = dto.Name ?? "", Role = dto.Role ?? "admin"
        };
        _db.Admins.Add(a);
        await _db.SaveChangesAsync();
        return Ok(new { a.Id, a.Email, a.Name, a.Role, a.CreatedAt, a.UpdatedAt });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UserInput dto)
    {
        var a = await _db.Admins.FindAsync(id);
        if (a is null) return NotFound();
        if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != a.Email
            && await _db.Admins.AnyAsync(x => x.Email == dto.Email))
            return BadRequest(new { error = "Bu e-posta zaten kullanımda." });

        a.Email = dto.Email ?? a.Email; a.Name = dto.Name ?? a.Name;
        a.Role = dto.Role ?? a.Role;
        if (!string.IsNullOrWhiteSpace(dto.Password))
            a.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, workFactor: 12);
        a.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(new { a.Id, a.Email, a.Name, a.Role, a.CreatedAt, a.UpdatedAt });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var a = await _db.Admins.FindAsync(id);
        if (a is null) return NotFound();
        var count = await _db.Admins.CountAsync();
        if (count <= 1) return BadRequest(new { error = "Son admin kullanıcı silinemez." });
        _db.Admins.Remove(a);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public class UserInput
{
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? Name { get; set; }
    public string? Role { get; set; }
}