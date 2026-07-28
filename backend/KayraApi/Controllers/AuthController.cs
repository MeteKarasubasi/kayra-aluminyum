using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayraApi.Data;
using KayraApi.DTOs;
using KayraApi.Services;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/admin")]
public class AuthController : ControllerBase
{
    private readonly KayraDbContext _db;
    private readonly JwtTokenService _jwt;
    public AuthController(KayraDbContext db, JwtTokenService jwt) { _db = db; _jwt = jwt; }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var admin = await _db.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email);
        if (admin is null || !BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash))
            return Unauthorized(new { error = "E-posta veya şifre hatalı." });

        return Ok(new { token = _jwt.CreateToken(admin), admin = new { admin.Id, admin.Email, admin.Name, admin.Role } });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var id = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                 ?? User.FindFirst("sub")?.Value;
        var admin = await _db.Admins.Where(a => a.Id == id)
            .Select(a => new { a.Id, a.Email, a.Name, a.Role }).FirstOrDefaultAsync();
        if (admin is null) return NotFound();
        return Ok(admin);
    }
}