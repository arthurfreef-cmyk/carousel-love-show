import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PIXEL_ID = "28147467658255223";
const GRAPH_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

const capiSchema = z.object({
  eventName: z.enum(["PageView", "ViewContent", "InitiateCheckout", "AddPaymentInfo", "Purchase"]),
  eventId: z.string().min(1),
  value: z.number().optional(),
  currency: z.string().optional().default("BRL"),
  contentName: z.string().optional(),
  contentIds: z.array(z.string()).optional(),
  orderId: z.string().optional(),
  numItems: z.number().optional(),
  sourceUrl: z.string().url().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
  userAgent: z.string().optional(),
  // Dados do usuário para correspondência avançada (hasheados no servidor)
  email: z.string().optional(),
  phone: z.string().optional(),
  name: z.string().optional(),
  document: z.string().optional(),
  zipcode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const normText = (v: string) => v.trim().toLowerCase();
const normDigits = (v: string) => v.replace(/\D/g, "");

export const sendCapiEvent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => capiSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean; status: number }> => {
    const token = process.env["META_CAPI_ACCESS_TOKEN"];
    if (!token) {
      return { ok: false, status: 0 };
    }

    const userData: Record<string, unknown> = {
      client_user_agent: data.userAgent,
      fbp: data.fbp,
      fbc: data.fbc,
      country: [await sha256Hex("br")],
    };
    if (data.email) userData["em"] = [await sha256Hex(normText(data.email))];
    if (data.phone) userData["ph"] = [await sha256Hex(`55${normDigits(data.phone)}`)];
    if (data.name) userData["fn"] = [await sha256Hex(normText(data.name).split(" ")[0] ?? "")];
    if (data.document) userData["external_id"] = [await sha256Hex(normDigits(data.document))];
    if (data.zipcode) userData["zp"] = [await sha256Hex(normDigits(data.zipcode))];
    if (data.city) userData["ct"] = [await sha256Hex(normText(data.city))];
    if (data.state) userData["st"] = [await sha256Hex(normText(data.state))];
    for (const k of Object.keys(userData)) {
      if (userData[k] === undefined) delete userData[k];
    }

    const event: Record<string, unknown> = {
      event_name: data.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: data.eventId,
      action_source: "website",
      event_source_url: data.sourceUrl,
      user_data: userData,
    };
    if (data.value !== undefined) {
      event["custom_data"] = {
        value: data.value,
        currency: data.currency,
        content_name: data.contentName,
        content_ids: data.contentIds,
        content_type: "product",
        order_id: data.orderId,
        num_items: data.numItems,
      };
    }

    const res = await fetch(`${GRAPH_URL}?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [event] }),
    });
    return { ok: res.ok, status: res.status };
  });
