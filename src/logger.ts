/**
 * ─── MCP Logger ───────────────────────────────────────────────────────────────
 *
 * MCP sunucusu stdio üzerinden çalıştığı için console.log() kesinlikle
 * kullanılamaz — stdout'a yazan her şey MCP protokolünü bozar.
 *
 * Bu modül tüm logları process.stderr'e yazar.
 * Claude Desktop'ın MCP log panelinde veya terminalde görünür.
 */

// ─── ANSI Renk Kodları ────────────────────────────────────────────────────────
const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  cyan:   "\x1b[36m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  blue:   "\x1b[34m",
  gray:   "\x1b[90m",
};

function timestamp(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 23);
}

function write(line: string): void {
  process.stderr.write(line + "\n");
}

// ─── Log Seviyeleri ───────────────────────────────────────────────────────────

/** Genel bilgi logu */
export function logInfo(message: string): void {
  write(`${C.gray}[${timestamp()}]${C.reset} ${C.blue}ℹ INFO   ${C.reset} ${message}`);
}

/**
 * Claude bir tool'u çağırdığında → istek gönderilmeden ÖNCE loglanır.
 *
 * @param toolName  - MCP tool adı (örn: "stok_listele")
 * @param method    - HTTP metodu (GET, POST, PUT, DELETE)
 * @param path      - Çözülmüş path (örn: "/api/Stok/123")
 * @param params    - Query parametreleri objesi
 * @param body      - PUT/POST body (varsa)
 */
export function logRequest(
  toolName: string,
  method: string,
  path: string,
  params?: Record<string, unknown>,
  body?: unknown
): void {
  const methodColor =
    method === "GET"    ? C.green  :
    method === "POST"   ? C.cyan   :
    method === "PUT"    ? C.yellow :
    method === "DELETE" ? C.red    : C.reset;

  write(
    `${C.gray}[${timestamp()}]${C.reset} ` +
    `${C.bold}${methodColor}⬆ ${method.padEnd(6)}${C.reset} ` +
    `${C.bold}${path}${C.reset}` +
    `${C.gray} ← tool: ${toolName}${C.reset}`
  );

  if (params && Object.keys(params).length > 0) {
    write(
      `${C.gray}             query : ${JSON.stringify(params)}${C.reset}`
    );
  }

  if (body !== undefined) {
    const bodyStr = typeof body === "string" ? body : JSON.stringify(body);
    write(
      `${C.gray}             body  : ${bodyStr.slice(0, 300)}${bodyStr.length > 300 ? "…" : ""}${C.reset}`
    );
  }
}

/**
 * API'den yanıt döndüğünde loglanır.
 *
 * @param path       - Endpoint path'i
 * @param statusCode - HTTP durum kodu
 * @param recordCount - Dönen kayıt sayısı (tahmin)
 * @param durationMs - İstek süresi (ms)
 */
export function logResponse(
  path: string,
  statusCode: number,
  recordCount: number | string,
  durationMs: number
): void {
  const ok = statusCode >= 200 && statusCode < 300;
  const icon = ok ? `${C.green}✔` : `${C.yellow}⚠`;

  write(
    `${C.gray}[${timestamp()}]${C.reset} ` +
    `${icon} ${C.bold}${statusCode}${C.reset}    ` +
    `${C.gray}${path}${C.reset}` +
    `  kayıt: ${C.bold}${recordCount}${C.reset}` +
    `  ${C.dim}${durationMs}ms${C.reset}`
  );
}

/**
 * Hata oluştuğunda loglanır.
 *
 * @param path       - Endpoint path'i
 * @param statusCode - HTTP durum kodu (yoksa "N/A")
 * @param message    - Hata mesajı
 * @param durationMs - İstek süresi (ms)
 */
export function logError(
  path: string,
  statusCode: number | string,
  message: string,
  durationMs: number
): void {
  write(
    `${C.gray}[${timestamp()}]${C.reset} ` +
    `${C.red}✖ ${statusCode}    ` +
    `${path}${C.reset}` +
    `  ${C.dim}${durationMs}ms${C.reset}`
  );
  write(`${C.red}             hata  : ${message.slice(0, 500)}${C.reset}`);
}
