# KAYRAB Aluminyum — Görev Takip

## Faz 1 — Eksik Sayfalar & Navbar
- `[x]` İletişim sayfası oluşturma
- `[x]` Referanslar sayfası oluşturma
- `[x]` Navbar: Referanslar linki + "Bayi Giriş" badge
- `[x]` i18n güncellemeleri + footer güncellemesi

## Faz 2 — Proje Detay Sayfaları
- `[x]` Proje data model genişletme
- `[x]` Proje kartlarını tıklanabilir yapma
- `[x]` Proje detay sayfası oluşturma

## Faz 3 — Veritabanı & Prisma
- `[x]` PostgreSQL + Prisma 7 kurulumu (driver adapter `@prisma/adapter-pg`)
- `[x]` Veritabanı şeması oluşturma (prisma.config.ts + schema.prisma)
- `[x]` Seed dosyası (admin@kayrab.com.tr / admin123, 6 ürün, 3 proje, 14 referans, 10 ayar)

## Faz 4 — API Routes
- `[x]` Public API routes (products, projects, references, contact, visits)
- `[x]` Admin API routes (login, logout, me, projects, products, references, messages, stats, settings)

## Faz 5 — Admin Panel
- `[x]` Admin login sayfası
- `[x]` Admin layout (sidebar + topbar + auth guard)
- `[x]` Admin dashboard (stat kartları + son mesajlar)
- `[x]` Admin CRUD sayfaları (proje/ürün/referans)
- `[x]` Admin mesaj yönetimi
- `[x]` Admin istatistikler/analytics
- `[x]` Admin ayarlar

## Faz 6 — Güvenlik
- `[x]` Middleware (auth guard, security headers)
- `[x]` Auth sistemi (JWT + bcrypt)

## Faz 7 — Entegrasyon
- `[x]` Ziyaret logları tracking (VisitTracker component)
- `[x]` Public sayfaları DB'den veri çekecek şekilde güncelleme (lib/data.server.ts with fallback)
- `[x]` Build doğrulama & son kontroller

## Production'a geçiş notları
- MSSQL 17'ye geçiş: `@prisma/adapter-mssql` kullanılacak, `prisma.config.ts` ve `lib/db.ts` güncellenecek
- `.env` production değerleriyle değiştirilecek (DATABASE_URL, JWT_SECRET)
- `next.config.mjs`'de `typescript.ignoreBuildErrors: true` kaldırılacak