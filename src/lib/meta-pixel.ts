// Meta Pixel (cliente) — helpers tipados e inicialização.
// O script base é injetado via head() em __root.tsx.

export const META_PIXEL_ID = "1469021404979283";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function fbq(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

// Gera um event_id único para deduplicar Pixel (navegador) x CAPI (servidor)
export function newEventId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
}

// Garante o _fbc quando o usuário chega por anúncio (?fbclid=...) antes do Pixel gravar o cookie
function ensureFbc(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const existing = readCookie("_fbc");
  if (existing) return existing;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return undefined;
  const value = `fb.1.${Date.now()}.${fbclid}`;
  document.cookie = `_fbc=${value}; path=/; max-age=${60 * 60 * 24 * 90}`;
  return value;
}

export function getMetaCookies() {
  return { fbp: readCookie("_fbp"), fbc: ensureFbc() };
}

type EventPayload = {
  eventId: string;
  value?: number;
  currency?: string;
  contentName?: string;
  contentIds?: string[];
};

function customData(params: EventPayload) {
  const data: Record<string, unknown> = {};
  if (params.value !== undefined) {
    data['value'] = params.value;
    data['currency'] = params.currency ?? "BRL";
  }
  if (params.contentName) data['content_name'] = params.contentName;
  if (params.contentIds) {
    data['content_ids'] = params.contentIds;
    data['content_type'] = "product";
  }
  return data;
}

export function trackPageView(eventId?: string) {
  fbq("track", "PageView", {}, eventId ? { eventID: eventId } : undefined);
}

export function trackInitiateCheckout(params: EventPayload) {
  fbq("track", "InitiateCheckout", customData(params), { eventID: params.eventId });
}

export function trackAddPaymentInfo(params: EventPayload) {
  fbq("track", "AddPaymentInfo", customData(params), { eventID: params.eventId });
}

export function trackPurchase(params: EventPayload) {
  fbq("track", "Purchase", customData(params), { eventID: params.eventId });
}
