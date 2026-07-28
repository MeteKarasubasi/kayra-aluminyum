using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using KayraApi.Data;
using KayraApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Connection string 'Default' not found.");

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<KayraDbContext>(o => o.UseNpgsql(connectionString));
}
else
{
    builder.Services.AddDbContext<KayraDbContext>(o => o.UseSqlServer(connectionString));
}

builder.Services.AddScoped<JwtTokenService>();

var jwtKey = builder.Configuration["Jwt:Secret"] ?? "kayra-dev-secret-change-in-production-32+chars";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "KayraApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "KayraAdmin";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? new[] { "http://localhost:5500", "http://127.0.0.1:5500" })
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.Use(async (ctx, next) =>
{
    var path = ctx.Request.Path.Value ?? "";
    if (path.StartsWith("/docs/") || path.StartsWith("/uploads/"))
    {
        ctx.Response.Headers["Cross-Origin-Resource-Policy"] = "cross-origin";
        ctx.Response.Headers["Access-Control-Allow-Origin"] = "*";
        ctx.Response.Headers["Content-Disposition"] = "inline";
    }
    await next();
});
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<KayraDbContext>();
    await DbSeeder.SeedAsync(db);
}

app.Run();
