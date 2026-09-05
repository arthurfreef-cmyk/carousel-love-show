/**
 * Captura e persistência de parâmetros de rastreamento (UTMs e click IDs).
 *
 * Os parâmetros chegam na URL da primeira visita (ex.: anúncios com
 * utm_source, utm_campaign, fbclid) e ficam salvos para serem reutilizados
 * no checkout e nos eventos de conversão, mesmo após navegações internas.
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string;
  src?: string;
  sck?: string;
}

const STORAGE_KEY = "udl_utm_params";
const TRACKED_KEYS: (keyof UtmParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
  "src",
  "sck",
];

/** Lê os parâmetros da URL atual e mescla com os já salvos (primeira visita vence). */
export function captureUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  const existing = getUtmParams();
  const search = new URLSearchParams(window.location.search);
  const merged: UtmParams = { ...existing };
  let changed = false;

  for (const key of TRACKED_KEYS) {
    const value = search.get(key);
    if (value && !merged[key]) {
      merged[key] = value;
      changed = true;
    }
  }

  if (changed) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      /* storage indisponível — ignora */
    }
  }
  return merged;
}

/** Retorna os parâmetros salvos (objeto vazio se não houver). */
export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}
