# Kayra Aluminyum — UI & Fonksiyon İyileştirme Planı

Aşağıdaki sorunlar kapsamlı şekilde ele alınmaktadır:

## Kök Sorun: Görseller Neden Görünmüyor

Admin panelden yüklenen fotoğraflar `.NET backend` sunucusuna (`localhost:5281`) kaydedilir ve relative URL'ler döner (örn. `/uploads/xxxx.png`). Frontend ise farklı bir sunucudan (ya da statik olarak) servis edildiğinden, bu relative path'ler çalışmaz.

> [!IMPORTANT]
> **Çözüm:** Frontend tarafında tüm görsel URL'leri gösterilirken, eğer URL `/uploads/` veya `/docs/` ile başlıyorsa, otomatik olarak backend base URL (`http://localhost:5281`) prefix'i eklenecek. Bu, `api.js` ve `referanslar.html`, `projeler.html`, `project-detail.js` gibi tüm tüketici sayfalarında uygulanacak.

---

## Yapılacak Değişiklikler

### 1. Görsel URL Çözümleme (Tüm Sayfalar)

#### [MODIFY] [config.js](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/js/config.js)
- `window.KAYRA_BACKEND_BASE` değişkeni eklenecek (backend origin'i)
- Yeni `resolveUrl(url)` fonksiyonu — `/uploads/` ve `/docs/` ile başlayan URL'leri tam URL'ye dönüştürür

#### [MODIFY] [referanslar.html](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/referanslar.html)
- Referans logo URL'lerinde `resolveUrl()` kullanılacak

#### [MODIFY] [projeler.html](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/projeler.html)
- Proje görsellerinde `resolveUrl()` kullanılacak

#### [MODIFY] [project-detail.js](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/js/project-detail.js)
- Hero, galeri ve ürün görsellerinde `resolveUrl()` kullanılacak

#### [MODIFY] [katalog.html](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/katalog.html)
- Katalog PDF URL'si zaten doğru çözümleniyor, ek kontrol eklenecek

---

### 2. Kategori Filtreleri — Sarı Badge Tasarımı

#### [MODIFY] [projeler.html](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/projeler.html)
- Filter butonları `bg-primary` pill yerine sarı badge (`bg-primary text-primary-foreground`) ile belirginleştirilecek
- Aktif filtre tıklandığında siyah yerine sarı arka planlı, yuvarlak badge görünümü alacak
- `z-index` relative positioning düzeltmesi yapılacak

#### [MODIFY] [app.css](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/css/app.css)
- `.filter-btn` ve `.filter-btn.active` stilleri eklenecek

---

### 3. Kaydırılabilir Kartlar — Profesyonel Tasarım

#### [MODIFY] [catalog-deck.js](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/js/catalog-deck.js)
- Kart yapısı güncelleniyor: gradient overlay, daha büyük boy, glassmorphism kart gövdesi
- Aktif kartın gölge ve border efektleri artırılıyor

#### [MODIFY] [app.css](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/css/app.css)
- `.catalog-card` boyut, gölge ve hover efektleri iyileştirilecek
- Gradient overlay ve aktif kart vurgulama stilleri eklenecek
- Aktif kart için primary border glow efekti

---

### 4. Admin Katalog Sayfası — Profesyonel Tasarım + Önizleme

#### [MODIFY] [admin/katalog.html](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/admin/katalog.html)
- Sayfayı tam yeniden tasarla: PDF önizleme penceresi (iframe)
- Mevcut PDF varsa inline iframe ile gösterilecek
- Upload sonrası otomatik önizleme

#### [MODIFY] [admin/catalog.js](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/js/admin/catalog.js)
- PDF yükleme sonrası iframe ile önizleme gösterilecek
- Profesyonel layout: macOS-style pencere chrome, dosya bilgisi

---

### 5. Admin Upload Önizleme — Tüm Yükleme Alanlarında

#### [MODIFY] [ui.js](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/js/admin/ui.js)
- `uploadField()` fonksiyonu: görsel yüklemede büyük önizleme kutusu eklenecek
- `bindUpload()` fonksiyonu: yükleme sonrası canlı önizleme güncellenmesi
- Drag-and-drop desteği güçlendirilecek
- PDF dosyaları için dosya adı + boyut bilgisi

#### [MODIFY] [admin.css](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/css/admin.css)
- Upload zone ve preview stilleri iyileştirilecek
- Profesyonel önizleme kutuları, hover efektleri

---

### 6. Referans Görselleri Doğru Eklenmiyor

#### [MODIFY] [references.js](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/js/admin/references.js)
- Form verisi `logo` alanının doğru okunması sağlanacak
- Upload sonrası hidden input değeri doğru güncelleniyor mu kontrol

---

### 7. Proje Galerisi — 10 Fotoğraf, Grid Görünüm

#### [MODIFY] [projects.js](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/js/admin/projects.js)
- Textarea yerine çoklu görsel yükleme alanı (max 10 fotoğraf)
- Grid önizleme: yüklenen görseller 3-4 sütunluk grid'de gösterilecek
- Her görseli kaldırma butonu
- Drag and drop destekli

#### [MODIFY] [project-detail.js](file:///Users/metekarasubasi1923/Documents/GitHub/kayra-aluminyum/frontend/js/project-detail.js)
- Galeri görselleri `resolveUrl()` ile çözümlenecek
- Grid düzeni iyileştirilecek

---

## Dokunulmayacak Dosyalar

- Next.js tarafı (backend, API routes) — bu değişiklikler sadece frontend HTML tarafında
- Prisma/DB şeması

## Doğrulama Planı

### Manuel Doğrulama
1. Admin panelden referans logo yükle → web sitesinde görünüyor mu kontrol et
2. Admin panelden proje görseli ve galeri yükle → web sitesinde görünüyor mu kontrol et
3. Katalog PDF yükle → admin önizleme + site görünümü kontrol
4. Kategori filtreleri tıkla → sarı badge görünümü kontrol
5. Kart tasarımı → profesyonel 3D deck görünümü kontrol
6. Proje galerisine 10 fotoğraf ekle → grid görünümü kontrol
