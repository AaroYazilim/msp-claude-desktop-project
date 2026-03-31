/**
 * 📄 config.ts — Swagger Generator Konfigürasyonu
 *
 * Bu dosya iki şeyi tanımlar:
 *
 *   1. SWAGGER_URL: Swagger JSON'un nereden okunacağı.
 *      - Yerel dosya yolu verilirse (http/https olmayan) → disk'ten okur (hızlı)
 *      - URL verilirse → ağdan indirir
 *      - .env'de SWAGGER_URL tanımlıysa onu kullanır, yoksa varsayılan değer geçerli
 *
 *   2. WHITELISTED_ENDPOINTS: Hangi API endpoint'lerinin MCP tool'una
 *      dönüştürüleceğini belirler. Tüm Swagger endpoint'leri değil,
 *      sadece bu listedekiler tool olarak kaydedilir.
 *
 * 📁 Yeni bir endpoint grubu eklemek için:
 *   1. src/swagger/endpoints/ altında yeni bir dosya oluştur (örn: fatura.ts)
 *   2. src/swagger/endpoints/index.ts'e import edip spread et
 */

import { WHITELISTED_ENDPOINTS as ENDPOINTS } from "./endpoints/index.js";
import type { EndpointConfig } from "./types.js";

export type { EndpointConfig };

/**
 * Hangi endpoint'lerin MCP tool'una dönüştürüleceğini belirler.
 * İçerik src/swagger/endpoints/ klasöründeki dosyalardan gelir:
 *   - cari.ts         → Cari hesap işlemleri
 *   - stok.ts         → Stok/ürün işlemleri
 *   - bankahesap.ts   → Banka hesap işlemleri
 *   - bankahareketleri.ts → Banka hareket işlemleri
 */
export const WHITELISTED_ENDPOINTS: EndpointConfig[] = ENDPOINTS;

/**
 * Swagger JSON'un okunacağı yol.
 *
 * Öncelik sırası:
 *   1. Ortam değişkeni: SWAGGER_URL (env veya .env dosyası)
 *   2. Varsayılan: ./src/swagger.json (yerel dosya)
 *
 * ⚠️ Not: Relative path verildiğinde index.ts içinde __dirname'e
 * göre absolute path'e çevrilir. Bu sayede Claude Desktop'ın
 * farklı bir çalışma dizininden başlatması sorun yaratmaz.
 */
export const SWAGGER_URL =
  process.env.SWAGGER_URL || "./src/swagger.json";
