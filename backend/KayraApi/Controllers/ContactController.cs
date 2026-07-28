using Microsoft.AspNetCore.Mvc;
using KayraApi.Data;
using KayraApi.DTOs;
using KayraApi.Models;
using KayraApi.Services;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    private readonly KayraDbContext _db;
    public ContactController(KayraDbContext db) => _db = db;

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ContactMessageDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Email)
            || string.IsNullOrWhiteSpace(dto.Message) || dto.Message.Length < 10)
            return BadRequest(new { error = "Name, Email ve Message (min 10 karakter) zorunludur." });

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var (country, city) = await GeoLocator.LocateAsync(ip);
        var lang = dto.Language ?? Request.Headers.AcceptLanguage.ToString().Split(',').FirstOrDefault();

        var msg = new ContactMessage
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim(),
            Phone = dto.Phone,
            Message = dto.Message.Trim(),
            System = dto.System,
            Language = lang,
            Ip = ip,
            Country = country,
            City = city
        };
        _db.ContactMessages.Add(msg);
        await _db.SaveChangesAsync();
        return Ok(new { ok = true, id = msg.Id });
    }
}