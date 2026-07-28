using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Security.Cryptography;

namespace KayraApi.Controllers;

[ApiController]
[Route("api/admin/upload")]
[Authorize]
public class AdminUploadController : ControllerBase
{
    private static readonly string[] AllowedImages = { ".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif" };
    private static readonly string[] AllowedDocs = { ".pdf" };
    private const long MaxImageBytes = 10 * 1024 * 1024; // 10 MB
    private const long MaxDocBytes = 50 * 1024 * 1024;   // 50 MB

    private readonly IWebHostEnvironment _env;
    public AdminUploadController(IWebHostEnvironment env) => _env = env;

    [HttpPost]
    [RequestSizeLimit(60 * 1024 * 1024)]
    public async Task<IActionResult> Upload(IFormFile file, [FromQuery] string type = "image")
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { error = "Dosya boş." });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowed = type == "doc" ? AllowedDocs : AllowedImages;
        var max = type == "doc" ? MaxDocBytes : MaxImageBytes;

        if (!allowed.Contains(ext))
            return BadRequest(new { error = "İzin verilmeyen dosya türü: " + ext });
        if (file.Length > max)
            return BadRequest(new { error = "Dosya çok büyük. Maks: " + (max / 1024 / 1024) + "MB" });

        var folder = type == "doc" ? "docs" : "uploads";
        var root = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), folder);
        Directory.CreateDirectory(root);

        var name = Guid.NewGuid().ToString("N") + ext;
        var path = Path.Combine(root, name);

        await using (var fs = System.IO.File.Create(path))
            await file.CopyToAsync(fs);

        var url = "/" + folder + "/" + name;
        return Ok(new { ok = true, url, filename = name, size = file.Length, contentType = file.ContentType });
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] string url)
    {
        if (string.IsNullOrWhiteSpace(url) || !url.StartsWith("/"))
            return BadRequest(new { error = "Geçersiz url." });
        var rel = url.TrimStart('/').Replace("..", "").Replace("//", "");
        var path = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), rel);
        if (!System.IO.File.Exists(path)) return NotFound();
        System.IO.File.Delete(path);
        return Ok(new { ok = true });
    }
}