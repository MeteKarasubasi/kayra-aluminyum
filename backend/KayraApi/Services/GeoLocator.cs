using System.Net;
using System.Text.Json;

namespace KayraApi.Services;

public static class GeoLocator
{
    private static readonly HashSet<string> LocalIpPrefixes = new() { "10.", "192.168.", "127.", "::1" };
    private static readonly HttpClient Client = new() { Timeout = TimeSpan.FromSeconds(3) };

    public static bool IsLocalIp(string? ip)
    {
        if (string.IsNullOrEmpty(ip)) return true;
        if (LocalIpPrefixes.Any(p => ip.StartsWith(p))) return true;
        if (ip.StartsWith("172."))
        {
            var parts = ip.Split('.');
            if (parts.Length >= 2 && int.TryParse(parts[1], out var second) && second >= 16 && second <= 31) return true;
        }
        if (ip.StartsWith("fc", StringComparison.OrdinalIgnoreCase) || ip.StartsWith("fd", StringComparison.OrdinalIgnoreCase)) return true;
        return false;
    }

    public static async Task<(string? country, string? city)> LocateAsync(string? ip)
    {
        if (IsLocalIp(ip)) return (null, null);
        try
        {
            var res = await Client.GetStringAsync($"http://ip-api.com/json/{ip}?fields=country,city");
            using var doc = JsonDocument.Parse(res);
            var country = doc.RootElement.TryGetProperty("country", out var c) ? c.GetString() : null;
            var city = doc.RootElement.TryGetProperty("city", out var ci) ? ci.GetString() : null;
            return (country, city);
        }
        catch { return (null, null); }
    }
}