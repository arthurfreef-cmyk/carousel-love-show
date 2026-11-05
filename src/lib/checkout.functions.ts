import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BASE_URL = "https://api.realtechdev.com.br";

export const KITS = {
  "1": { label: "1 Ultra D Lust", units: "1 frasco • 120 ml", reference: "R$ 30,90", price: "R$ 15,90", amount: 1590 },
  "3": { label: "Kit 3 Ultra D Lust", units: "3 frascos • 120 ml", reference: "R$ 59,90", price: "R$ 29,90", amount: 2990 },
  "5": { label: "Kit 5 Ultra D Lust", units: "5 frascos • 120 ml", reference: "R$ 97,00", price: "R$ 49,90", amount: 4990 },
} as const;

export type KitId = keyof typeof KITS;

export const SHIPPING = {
  standard: {
    label: "Frete padrão",
    eta: "Entrega em 3 a 5 dias úteis",
  },
  express: {
    label: "Frete expresso",
    eta: "Entrega em 1 a 2 dias úteis",
  },
} as const;

export type ShippingId = keyof typeof SHIPPING;

const onlyDigits = (v: string) => v.replace(/\D/g, "");

const checkoutSchema = z.object({
  kit: z.enum(["1", "3", "5"]),
  name: z.string().trim().min(3, "Informe seu nome completo"),
  email: z.string().trim().email("E-mail inválido"),
  shipping: z.enum(["standard", "express"]).default("standard"),
  shippingAmount: z.number().int().min(0).max(999),
  document: z.string().transform(onlyDigits).refine((v) => v.length === 11, "CPF inválido"),
  zipcode: z.string().transform(onlyDigits).refine((v) => v.length === 8, "CEP inválido"),
  street: z.string().trim().min(2),
  neighborhood: z.string().trim().min(2),
  city: z.string().trim().min(2),
  state: z.string().trim().length(2),
  number: z.string().trim().min(1, "Informe o número"),
}).superRefine((data, ctx) => {
  const validShippingAmount =
    data.shipping === "express"
      ? data.shippingAmount >= 801 && data.shippingAmount <= 999
      : data.shippingAmount === 0;

  if (!validShippingAmount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["shippingAmount"],
      message: "Valor de frete inválido para a modalidade selecionada.",
    });
  }
});

function buckpayHeaders() {
  return {
    Authorization: `Bearer ${process.env["BUCKPAY_TOKEN"]!}`,
    "User-Agent": process.env["BUCKPAY_USER_AGENT"] || "Buckpay API",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/**
 * A Buckpay pode devolver `error.detail` como string ou como objeto de
 * validação ({ campo: ["msg"] }). Normalizamos para uma frase legível.
 */
function extractError(payload: any, fallback: string): string {
  const raw = payload?.error?.detail ?? payload?.error?.message ?? payload?.message;
  if (typeof raw === "string" && raw.trim()) return raw;
  if (raw && typeof raw === "object") {
    const parts = Object.entries(raw).map(([field, msgs]) =>
      `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : String(msgs)}`,
    );
    if (parts.length) return parts.join(" • ");
  }
  return fallback;
}

function pickPix(payload: any) {

  const pix = payload?.pix ?? payload?.data?.pix ?? {};
  const code =
    pix.code ?? pix.qrcode ?? pix.qr_code ?? pix.copy_paste ?? pix.emv ?? payload?.qrcode ?? null;
  const image = pix.qrcode_base64 ?? pix.qr_code_base64 ?? pix.image ?? null;
  return { code: code as string | null, image: image as string | null };
}

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(async ({ data }) => {
    const kit = KITS[data.kit];
    const shipping = SHIPPING[data.shipping];
    const total = kit.amount + data.shippingAmount;
    const externalId = `udl-${data.kit}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const res = await fetch(`${BASE_URL}/v1/transactions`, {
      method: "POST",
      headers: buckpayHeaders(),
      body: JSON.stringify({
        external_id: externalId,
        payment_method: "pix",
        amount: total,
        buyer: {
          name: data.name,
          email: data.email,
          document: data.document,
        },
        items: [{ id: `kit-${data.kit}`, name: kit.label, price: kit.amount, quantity: 1 }],
        shipping: { amount: data.shippingAmount, name: shipping.label },
        address: {
          zipcode: data.zipcode,
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          country: "BR",
        },
      }),
    });

    const payload = await res.json().catch(() => ({}) as any);
    if (!res.ok) {
      console.error("[buckpay] erro", res.status, JSON.stringify(payload));
      throw new Error(extractError(payload, "Não foi possível gerar o Pix agora."));
    }


    const body = payload?.data ?? payload;
    const { code, image } = pickPix(body);

    return {
      externalId,
      id: body?.id ?? null,
      status: body?.status ?? "pending",
      amount: total,
      pixCode: code,
      pixImage: image,
    };
  });

export const getChargeStatus = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ externalId: z.string().min(3) }).parse(data))
  .handler(async ({ data }) => {
    const res = await fetch(
      `${BASE_URL}/v1/transactions/external_id/${encodeURIComponent(data.externalId)}`,
      { headers: buckpayHeaders() },
    );
    const payload = await res.json().catch(() => ({}) as any);
    const body = payload?.data ?? payload;
    return { status: (body?.status as string) ?? "pending" };
  });


