# Kayra Alüminyum — Statik HTML + .NET Core + MSSQL

Hosting Node.js desteklemediği için Next.js + PostgreSQL'ten statik HTML + .NET Core API + MSSQL 2019'a geçiş.

## Yapı
```
frontend/          # Statik HTML/CSS/JS (public site + admin panel)
backend/KayraApi/  # ASP.NET Core 10 Web API (EF Core + JWT)
prisma/            # Eski şema (blueprint, artık kullanılmıyor)
```

## Geliştirme (Mac)
```bash
# 1. API (PostgreSQL 17)
createdb kayrab_api
cd backend/KayraApi
ASPNETCORE_ENVIRONMENT=Development dotnet run --urls http://localhost:5000

# 2. Frontend (statik sunucu)
cd frontend
python3 -m http.server 5500
# → http://localhost:5500
# → admin: http://localhost:5500/admin/login.html
#   giriş: admin@kayrab.com.tr / admin123
```

## Production (Windows IIS + MSSQL 2019)

### 1. API publish
```powershell
cd backend\KayraApi
dotnet publish -c Release -o ..\publish\api
```

### 2. MSSQL veritabanı oluştur
```sql
CREATE DATABASE kayrab;
```

### 3. Connection string (appsettings.json)
```json
"ConnectionStrings": {
  "Default": "Server=SQL_SERVER;Database=kayrab;User Id=USER;Password=PWD;TrustServerCertificate=True"
}
```

### 4. Migration'ı MSSQL'e uygula
```powershell
cd ..\publish\api
$env:ASPNETCORE_ENVIRONMENT="Production"
dotnet KayraApi.dll  # ilk açılışta seed + migration
```
VEYA sadece migration:
```powershell
dotnet ef database update --configuration Production -- --environment Production
```

### 5. IIS yapılandırması
- **Application Pool**: .NET Core Hosting Bundle kurulu, "No Managed Code"
- **Site 1 (root)**: `frontend/` klasörü → statik dosyalar
- **Site 2 (/api alt uygulama)**: `publish/api/` → `web.config` AspNetCoreModuleV2
- **Yazma izni**: `wwwroot/uploads/` ve `wwwroot/docs/` klasörlerine IIS_IUSRS
- **HTTPS**: Sertifika bağla

### 6. Frontend API base ayarı
`frontend/js/config.js` production'da otomatik `/api` kullanır (aynı domain). Farklı domain ise `KAYRA_API_BASE`'i güncelle.

## Endpoint özeti
- Public: `/api/products`, `/api/projects`, `/api/references`, `/api/settings`, `/api/contact` (POST), `/api/visits` (POST)
- Admin (JWT): `/api/admin/login`, `/api/admin/me`, `/api/admin/{projects,products,references,messages,users,settings,stats,visits,cache}`, `/api/admin/upload`
- Statik: `/uploads/*`, `/docs/*` (API üzerinden sunulur)

## Notlar
- Mac'te PostgreSQL 17 + EF Core Npgsql; production'da MSSQL 2019 + EF Core SqlServer. Aynı DbContext, provider runtime'da seçilir.
- Seed: 1 admin, 6 ürün, 3 proje, 14 referans, 20 ayar (ilk açılışta `DbSeeder.SeedAsync`).
- Görseller dosya sisteminde (`wwwroot/uploads`, `wwwroot/docs`), DB'de sadece URL.
- JWT 12 saat geçerli, BCrypt(workFactor=12).