using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using KayraApi.Data;
using KayraApi.DTOs;
using KayraApi.Models;
using KayraApi.Services;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/visits")]
public class VisitsController : ControllerBase
{
    private static readonly Regex BotRegex = new(@"googlebot|bingbot|yandexbot|facebot|ia_archiver|mj12bot|ahrefsbot|semrushbot|dotbot|petalbot|bytespider|applebot|twitterbot|facebookexternalhit|linkedinbot|telegrambot|whatsapp|skypeuripreview|slurp|duckduckbot|baiduspider|sogou|exabot|ia_archiver|siteauditbot|seznambot", RegexOptions.IgnoreCase);

    private static readonly string[] StaticExtensions = { ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif", ".css", ".js", ".mjs", ".woff", ".woff2", ".ttf", ".eot", ".otf", ".pdf", ".zip", ".mp4", ".mp3", ".webm", ".ico" };

    private readonly KayraDbContext _db;
    public VisitsController(KayraDbContext db) => _db = db;

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] PageVisitDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Path)) return BadRequest(new { error = "Path zorunludur." });
        if (dto.Path.StartsWith("/admin") || dto.Path.StartsWith("/api")) return Ok(new { ok = true, skipped = true });
        var ext = Path.GetExtension(dto.Path.Split('?')[0]).ToLowerInvariant();
        if (StaticExtensions.Contains(ext)) return Ok(new { ok = true, skipped = true });

        var ua = Request.Headers.UserAgent.ToString();
        var isBot = BotRegex.IsMatch(ua);
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var (country, city) = await GeoLocator.LocateAsync(ip);
        var lang = dto.Language ?? Request.Headers.AcceptLanguage.ToString().Split(',').FirstOrDefault();

        var visit = new PageVisit
        {
            Path = dto.Path,
            Ip = ip,
            UserAgent = ua,
            Referrer = dto.Referrer,
            Country = country,
            City = city,
            Language = lang,
            Device = DetectDevice(ua),
            Browser = DetectBrowser(ua),
            IsBot = isBot
        };
        _db.PageVisits.Add(visit);
        await _db.SaveChangesAsync();
        return Ok(new { ok = true });
    }

    private static string DetectDevice(string ua) => ua switch
    {
        _ when ua.Contains("Mobile", StringComparison.OrdinalIgnoreCase) => "mobile",
        _ when ua.Contains("Tablet", StringComparison.OrdinalIgnoreCase) => "tablet",
        _ when string.IsNullOrEmpty(ua) => "unknown",
        _ => "desktop"
    };

    private static string DetectBrowser(string ua) => ua switch
    {
        _ when ua.Contains("Edg/", StringComparison.OrdinalIgnoreCase) => "edge",
        _ when ua.Contains("Chrome/", StringComparison.OrdinalIgnoreCase) => "chrome",
        _ when ua.Contains("Firefox/", StringComparison.OrdinalIgnoreCase) => "firefox",
        _ when ua.Contains("Safari/", StringComparison.OrdinalIgnoreCase) => "safari",
        _ => "other"
    };
}