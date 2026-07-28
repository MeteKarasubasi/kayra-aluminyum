using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using KayraApi.Models;

namespace KayraApi.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(KayraDbContext db)
    {
        await db.Database.MigrateAsync();

        if (!await db.Admins.AnyAsync())
        {
            db.Admins.Add(new Admin
            {
                Email = "admin@kayrab.com.tr",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123", workFactor: 12),
                Name = "KAYRAB Admin",
                Role = "admin"
            });
            await db.SaveChangesAsync();
        }

        if (!await db.Products.AnyAsync())
        {
            db.Products.AddRange(ProductSeed());
            await db.SaveChangesAsync();
        }

        if (!await db.Projects.AnyAsync())
        {
            db.Projects.AddRange(ProjectSeed());
            await db.SaveChangesAsync();
        }

        if (!await db.References.AnyAsync())
        {
            db.References.AddRange(ReferenceSeed());
            await db.SaveChangesAsync();
        }

        if (!await db.SiteSettings.AnyAsync())
        {
            db.SiteSettings.AddRange(SettingsSeed());
            await db.SaveChangesAsync();
        }
    }

    private static IEnumerable<Product> ProductSeed() => new[]
    {
        new Product { TitleTr = "Kış Bahçesi Sistemleri", TitleEn = "Winter Garden Systems", Slug = "kis-bahcesi",
            DescTr = "Dört mevsim konfor sunan, ısı yalıtımlı cam kış bahçeleri.",
            DescEn = "Heat-insulated glass winter gardens offering four-season comfort.",
            Image = "/images/product-winter-garden.png", Code = "01 / WG",
            FeaturesJson = "[\"Isı yalıtımı\",\"Ses yalıtımı\",\"Özel tasarım\"]", Order = 1 },
        new Product { TitleTr = "Bioklimatik Pergola", TitleEn = "Bioclimatic Pergola", Slug = "bioklimatik-pergola",
            DescTr = "Ayarlanabilir tavan kanatlarıyla güneşi ve gölgeyi kontrol edin.",
            DescEn = "Control sun and shade with adjustable louvered roof blades.",
            Image = "/images/product-pergola.png", Code = "02 / PG",
            FeaturesJson = "[\"Motorlu kanat sistemi\",\"Yağmur sensörü\",\"LED aydınlatma\"]", Order = 2 },
        new Product { TitleTr = "Korkuluk Sistemleri", TitleEn = "Railing Systems", Slug = "korkuluk",
            DescTr = "Cam ve alüminyum kombinasyonuyla güvenli, şık korkuluklar.",
            DescEn = "Safe, elegant railings combining glass and aluminium.",
            Image = "/images/product-railing.png", Code = "03 / RL",
            FeaturesJson = "[\"Temperli cam\",\"Paslanmaz çelik\",\"Kolay montaj\"]", Order = 3 },
        new Product { TitleTr = "Cam Balkon & Sürme Sistemler", TitleEn = "Glass Balcony & Sliding Systems", Slug = "cam-balkon",
            DescTr = "Katlanır ve sürme cam sistemleriyle kesintisiz manzara.",
            DescEn = "Uninterrupted views with folding and sliding glass systems.",
            Image = "/images/product-glass-balcony.png", Code = "04 / GB",
            FeaturesJson = "[\"Katlanır sistem\",\"Sürme sistem\",\"Rüzgar dayanımı\"]", Order = 4 },
        new Product { TitleTr = "Giydirme Cephe", TitleEn = "Curtain Wall", Slug = "giydirme-cephe",
            DescTr = "Yüksek yapılar için performanslı alüminyum cephe kaplamaları.",
            DescEn = "High-performance aluminium facade cladding for tall buildings.",
            Image = "/images/product-curtain-wall.png", Code = "05 / CW",
            FeaturesJson = "[\"Enerji verimliliği\",\"Deprem dayanımı\",\"Estetik tasarım\"]", Order = 5 },
        new Product { TitleTr = "Alüminyum Doğrama", TitleEn = "Aluminium Joinery", Slug = "aluminyum-dograma",
            DescTr = "İnce profilli, yalıtımlı kapı ve pencere doğrama sistemleri.",
            DescEn = "Slim-profile, insulated door and window joinery systems.",
            Image = "/images/product-joinery.png", Code = "06 / AJ",
            FeaturesJson = "[\"İnce profil\",\"Yüksek yalıtım\",\"Uzun ömür\"]", Order = 6 },
    };

    private static IEnumerable<Project> ProjectSeed() => new[]
    {
        new Project { Title = "Skyline Tower", Slug = "skyline-tower",
            Description = "İstanbul'un siluetine yeni bir boyut kazandıran 42 katlı konut projesi.",
            Location = "İstanbul", Category = "residential", Image = "/images/project-tower.png",
            GalleryJson = "[\"/images/project-tower.png\"]", ProductsJson = "[\"giydirme-cephe\",\"cam-balkon\"]",
            Area = "28.000 m²", Year = "2024", Client = "Skyline İnşaat", Order = 1 },
        new Project { Title = "Villa Doğa", Slug = "villa-doga",
            Description = "Bodrum'un turkuaz sularına bakan lüks villa projesi.",
            Location = "Bodrum", Category = "residential", Image = "/images/project-villa.png",
            GalleryJson = "[\"/images/project-villa.png\"]", ProductsJson = "[\"kis-bahcesi\",\"bioklimatik-pergola\",\"korkuluk\"]",
            Area = "1.200 m²", Year = "2023", Client = "Doğa Yapı", Order = 2 },
        new Project { Title = "Meva Cafe", Slug = "meva-cafe",
            Description = "Ankara'nın merkezinde modern bir cafe projesi.",
            Location = "Ankara", Category = "commercial", Image = "/images/project-cafe.png",
            GalleryJson = "[\"/images/project-cafe.png\"]", ProductsJson = "[\"cam-balkon\",\"bioklimatik-pergola\"]",
            Area = "450 m²", Year = "2024", Client = "Meva Grup", Order = 3 },
    };

    private static IEnumerable<Reference> ReferenceSeed()
    {
        var names = new[] {
            ("ARABICA","/images/references/arabica.svg"),("ARMADA","/images/references/armada.svg"),
            ("CONGRESIUM","/images/references/congresium.svg"),("GİMART","/images/references/gimart.svg"),
            ("MAGNOLIA","/images/references/magnolia.svg"),("MARUS","/images/references/marus.svg"),
            ("TEPE MOZAİK","/images/references/tepe-mozaik.svg"),("BEYKOZ","/images/references/beykoz.svg"),
            ("KOZA","/images/references/koza.svg"),("SYNLAB","/images/references/synlab.svg"),
            ("TÜRK TRAKTÖR","/images/references/turk-traktor.svg"),("WALKINN","/images/references/walkinn.svg"),
            ("KARAKAYA","/images/references/karakaya.svg"),("DÜVEROĞLU","/images/references/duveroglu.svg"),
        };
        return names.Select((n, i) => new Reference { Name = n.Item1, Logo = n.Item2, Order = i + 1 });
    }

    private static IEnumerable<SiteSetting> SettingsSeed()
    {
        var settings = new (string, string)[]
        {
            ("logo_url",""),("logo_text","KAYRAB"),("logo_subtext","ALUMINYUM"),
            ("catalog_pdf_url",""),("phone","+90 312 000 00 00"),("phone2","+90 312 000 00 01"),
            ("whatsapp","+90 312 000 00 00"),("email","info@kayrab.com.tr"),
            ("address_tr","Organize Sanayi Bölgesi, 5. Cad. No: 12, Ankara"),
            ("address_en","Organized Industrial Zone, 5th St. No: 12, Ankara"),
            ("hours_tr","Pazartesi – Cumartesi: 08:00 – 18:00"),
            ("hours_en","Monday – Saturday: 08:00 – 18:00"),
            ("google_maps_link","https://maps.google.com/?q=Ankara+Organize+Sanayi+B%C3%B6lgesi"),
            ("instagram","https://instagram.com/kayrabaluminyum"),
            ("facebook","https://facebook.com/kayrabaluminyum"),("youtube",""),
            ("linkedin","https://linkedin.com/company/kayrab"),
            ("site_title","KAYRAB Aluminyum | Alüminyum & Cam Sistemleri"),
            ("slogan","Işığı ve mekânı yeniden tasarlayan alüminyum çözümler"),
            ("seo_description","KAYRAB Aluminyum; kış bahçesi, bioklimatik pergola, korkuluk, cam balkon, giydirme cephe ve alüminyum doğrama sistemlerinde güvenilir çözüm ortağınız."),
        };
        return settings.Select(s => new SiteSetting { Key = s.Item1, Value = s.Item2 });
    }
}