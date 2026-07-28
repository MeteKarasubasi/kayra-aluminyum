using Microsoft.EntityFrameworkCore;
using KayraApi.Data;
using KayraApi.Models;

namespace KayraApi.Services;

public static class AuditLogger
{
    public static async Task LogAsync(KayraDbContext db, string adminId, string action, string? target = null, string? details = null)
    {
        try
        {
            db.AdminLogs.Add(new AdminLog
            {
                AdminId = adminId,
                Action = action,
                Target = target,
                Details = details
            });
            await db.SaveChangesAsync();
        }
        catch
        {
        }
    }
}