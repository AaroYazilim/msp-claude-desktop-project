import type { EndpointConfig } from "../types.js";

export const BANKAHAREKETLERİ_ENDPOINTS: EndpointConfig[] = [
  // 🔍 /api/BankaHareketleri GET
  {
    path: "/api/BankaHareketleri",
    method: "get",
    toolName: "banka_hareketleri_listele",
    description:
      "Filtrelenmiş banka hareket listesini getirir. " +
      "Banka hesapları bazında işlem detayları ve bakiye analizi sunar. " +
      "Banka ekstre kontrolleri, günlük nakit akış takibi, ödeme ve tahsilat doğrulamaları için kullanılabilir. " +
      'Kullanıcının "Bugün bankaya ne kadar para geldi?", "X bankasındaki son işlemler" veya "Z tedarikçisine yapılan havale kaydı" gibi finansal sorgularında ana veri kaynağıdır. ' +
      "Filtreleme, tarih aralığı ve diğer query parametreleri ile sonuçlar daraltılabilir. " +
      "Servisten dönen yanıt aynen kullanıcıya iletilir.",
    source: "bankahareketleri.ts",
  },
];
