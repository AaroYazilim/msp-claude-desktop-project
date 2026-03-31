/**
 * 📄 endpoints/index.ts — Tüm Endpoint Gruplarını Birleştirir
 *
 * Bu dosya, farklı modüllerdeki endpoint listelerini tek bir dizi halinde
 * birleştirir. generator.ts bu diziyi okuyarak MCP tool'larını oluşturur.
 *
 * 📌 Yeni bir endpoint grubu eklemek için:
 *   1. Bu klasörde yeni bir dosya oluştur (örn: fatura.ts)
 *   2. Dosyada EndpointConfig[] listesi export et
 *   3. Aşağıya import ekle ve ...FATURA_ENDPOINTS ile spread et
 *
 * Mevcut gruplar:
 *   - cari.ts             → Cari hesap (müşteri/tedarikçi) işlemleri
 *   - stok.ts             → Stok ve ürün işlemleri
 *   - bankahesap.ts       → Banka hesapları
 *   - bankahareketleri.ts → Banka hareketleri / ekstreleri
 */

import { CARI_ENDPOINTS } from "./cari.js";
import { STOK_ENDPOINTS } from "./stok.js";
import { BANKAHESAP_ENDPOINTS } from "./bankahesap.js";
import { BANKAHAREKETLERİ_ENDPOINTS } from "./bankahareketleri.js";

import type { EndpointConfig } from "../types.js";

/**
 * Sisteme kayıtlı tüm endpoint'lerin birleşik listesi.
 * config.ts → WHITELISTED_ENDPOINTS olarak export edilir.
 * generator.ts bu listeyi iterasyonla gezerek tool kaydeder.
 */
export const WHITELISTED_ENDPOINTS: EndpointConfig[] = [
  ...CARI_ENDPOINTS,
  ...STOK_ENDPOINTS,
  ...BANKAHESAP_ENDPOINTS,
  ...BANKAHAREKETLERİ_ENDPOINTS,
];
