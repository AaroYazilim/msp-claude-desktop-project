# AARO ERP MCP Server

AARO ERP sistemini **Claude Desktop** ile entegre eden bir [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server'ıdır. Claude, bu server aracılığıyla ERP API'sine doğrudan erişebilir; cari sorgulama, güncelleme, silme ve stok hareketleri gibi işlemleri doğal dil komutlarıyla gerçekleştirebilir.

---

## 🚀 Özellikler

- **Swagger'dan otomatik tool üretimi** — `config.ts`'e endpoint eklemek yeterli, gerisi otomatik
- **GET, PUT & DELETE** HTTP metodu desteği
- **Path parametresi desteği** — `/api/Cari/{id}` gibi endpoint'ler tam desteklenir
- **PUT body desteği** — Claude JSON string olarak body gönderebilir, otomatik parse edilir
- **Bearer token yönetimi** — `.env` üzerinden merkezi token, ya da her tool çağrısında ayrı token
- **Stdio transport** — Claude Desktop ile doğrudan uyumlu
- **Hata yönetimi** — ERP'den gelen hata mesajları Claude'a anlaşılır biçimde iletilir

---

## 📁 Proje Yapısı

```
mcpserver/
├── src/
│   ├── index.ts                # Server başlangıç noktası
│   ├── swagger/
│   │   ├── config.ts           # ⭐ Whitelist — hangi endpoint'ler aktif
│   │   ├── generator.ts        # Swagger → MCP Tool dönüştürücü
│   │   └── loader.ts           # Swagger JSON indirici & parser
│   └── erp/
│       └── client.ts           # Axios tabanlı ERP API istemcisi
├── .env                        # Gizli config (Git'e gitmez)
├── .env.example                # Örnek config şablonu
├── not.json                    # Swagger dökümanı (lokal yedek)
├── tsconfig.json
└── package.json
```

---

## ⚙️ Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. `.env` Dosyasını Oluştur

```bash
cp .env.example .env
```

`.env` içeriği:

```env
ERP_BASE_URL=https://erp.aaro.com.tr
ERP_BEARER_TOKEN=buraya_token_gelecek
SWAGGER_URL=https://erp.aaro.com.tr/swagger/docs/v1
```

### 3. Build Al

```bash
npm run build
```

---

## 🖥️ Claude Desktop Entegrasyonu

`claude_desktop_config.json` dosyasına aşağıdaki bloğu ekleyin:

```json
{
  "mcpServers": {
    "aaro-erp": {
      "command": "node",
      "args": ["C:/Users/taha/Desktop/mcpserver/dist/index.js"]
    }
  }
}
```

> Dosya genellikle şurada bulunur:  
> `%APPDATA%\Claude\claude_desktop_config.json`

Claude Desktop'ı yeniden başlattıktan sonra tool'lar aktif olur.

---

## 🛠️ Mevcut Tool'lar

| Tool Adı | Method | Endpoint | Açıklama |
|---|---|---|---|
| `cari_hareketleri_listele` | GET | `/api/CariHareketleri` | Cari hesap hareketleri |
| `cari_hareketleri_pivot` | GET | `/api/CariHareketleri/Pivot` | Pivot formatında hareketler |
| `cari_bakiye` | GET | `/api/Cari/Bakiye` | Güncel bakiyeler |
| `cari_getir` | GET | `/api/Cari/{id}` | ID'ye göre cari detay |
| `cari_guncelle` | PUT | `/api/Cari/{id}` | Cari kartı güncelle |
| `cari_sil` | DELETE | `/api/Cari/{id}` | Cari kartı sil / pasifleştir |
| `cari_listele` | GET | `/api/Cari` | Cari kartları listele |
| `stok_hareketleri_listele` | GET | `/api/StokHareketleri` | Stok hareketleri |
| `stok_hareketleri_pivot` | GET | `/api/StokHareketleri/Pivot` | Pivot formatında stok hareketleri |
| `stok_listele` | GET | `/api/Stok` | Stok kartları listele |

---

## 💬 Kullanım Örnekleri (Claude Desktop)

```
Son 10 cari hareketini listele
```
```
ID'si 98 olan cariyi getir
```
```
98 numaralı carinin adını "ABC Ticaret" olarak güncelle
```
```
ID'si 98 olan cariyi sil
```
```
ABC Ticaret'in bakiyesini göster
```
```
Stok hareketlerini pivot formatında getir
```

---

## ➕ Yeni Endpoint Ekleme

`src/swagger/config.ts` içindeki `WHITELISTED_ENDPOINTS` dizisine yeni bir giriş eklemek yeterlidir:

```typescript
// GET örneği
{
  path: "/api/Stok/{id}",
  method: "get",
  toolName: "stok_getir",
  description: "ID'ye göre stok kartı getirir.",
},
// PUT örneği
{
  path: "/api/Stok/{id}",
  method: "put",
  toolName: "stok_guncelle",
  description: "Stok kartını günceller. body JSON string olarak gönderilmelidir.",
},
// DELETE örneği
{
  path: "/api/Stok/{id}",
  method: "delete",
  toolName: "stok_sil",
  description: "Stok kartını siler veya pasifleştirir.",
},
```

Ardından yeniden build alın:

```bash
npm run build
```

> Parametre şeması Swagger'dan **otomatik** üretilir. PUT için `body` alanı da otomatik eklenir.

---

## 🔧 Geliştirme

```bash
# Development modunda çalıştır (build gerekmez)
npm run dev

# TypeScript tip kontrolü
npm run typecheck

# Production build
npm run build
```

---

## 🔐 Güvenlik Notları

- `.env` dosyası asla Git'e commit edilmemelidir (`.gitignore`'da mevcut)
- Bearer token her API çağrısında `Authorization: Bearer <token>` header'ı ile gönderilir
- **DELETE işlemleri geri alınamaz** — bağlı hareketi olan cariler silinmez, yalnızca pasifleştirilir
- **PUT işlemleri kalıcıdır** — güncelleme yapmadan önce mevcut kayıt `cari_getir` ile kontrol edilebilir

---

## 📦 Teknoloji Yığını

| Paket | Versiyon | Amaç |
|---|---|---|
| `@modelcontextprotocol/sdk` | ^1.27.1 | MCP server altyapısı |
| `axios` | ^1.13.6 | HTTP istemcisi |
| `zod` | — | Input validasyonu |
| `typescript` | ^5.9.3 | Tip güvenliği |
| `tsx` | ^4.21.0 | Dev modunda TS çalıştırma |
