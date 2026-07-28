using Microsoft.EntityFrameworkCore;
using KayraApi.Models;

namespace KayraApi.Data;

public class KayraDbContext : DbContext
{
    public KayraDbContext(DbContextOptions<KayraDbContext> options) : base(options) { }

    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Reference> References => Set<Reference>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<PageVisit> PageVisits => Set<PageVisit>();
    public DbSet<AdminLog> AdminLogs => Set<AdminLog>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(e =>
        {
            e.HasKey(a => a.Id);
            e.HasIndex(a => a.Email).IsUnique();
            e.Property(a => a.Email).HasMaxLength(256);
            e.Property(a => a.PasswordHash).HasMaxLength(256);
            e.Property(a => a.Name).HasMaxLength(128);
            e.Property(a => a.Role).HasMaxLength(32);
            e.HasMany(a => a.Logs).WithOne(l => l.Admin!)
                .HasForeignKey(l => l.AdminId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Project>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasIndex(p => p.Slug).IsUnique();
            e.Property(p => p.Description).HasColumnType("text");
            e.Property(p => p.GalleryJson).HasColumnType("text");
            e.Property(p => p.ProductsJson).HasColumnType("text");
            e.HasIndex(p => p.IsActive);
            e.HasIndex(p => p.Category);
        });

        modelBuilder.Entity<Product>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasIndex(p => p.Slug).IsUnique();
            e.Property(p => p.DescTr).HasColumnType("text");
            e.Property(p => p.DescEn).HasColumnType("text");
            e.Property(p => p.FeaturesJson).HasColumnType("text");
            e.HasIndex(p => p.IsActive);
        });

        modelBuilder.Entity<Reference>(e =>
        {
            e.HasKey(r => r.Id);
            e.HasIndex(r => r.IsActive);
        });

        modelBuilder.Entity<ContactMessage>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Message).HasColumnType("text");
            e.HasIndex(c => c.IsRead);
            e.HasIndex(c => c.IsSpam);
            e.HasIndex(c => c.CreatedAt);
        });

        modelBuilder.Entity<PageVisit>(e =>
        {
            e.HasKey(v => v.Id);
            e.HasIndex(v => v.Path);
            e.HasIndex(v => v.CreatedAt);
            e.HasIndex(v => v.Country);
            e.HasIndex(v => v.IsBot);
        });

        modelBuilder.Entity<AdminLog>(e =>
        {
            e.HasKey(l => l.Id);
            e.Property(l => l.Details).HasColumnType("text");
            e.HasIndex(l => l.AdminId);
            e.HasIndex(l => l.CreatedAt);
        });

        modelBuilder.Entity<SiteSetting>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasIndex(s => s.Key).IsUnique();
            e.Property(s => s.Value).HasColumnType("text");
            e.Property(s => s.Key).HasMaxLength(64);
        });
    }
}