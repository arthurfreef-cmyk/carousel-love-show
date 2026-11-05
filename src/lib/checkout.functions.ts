import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BASE_URL = "https://api.fruitfy.io/api";

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
  phone: z.string().transform(onlyDigits).refine((v) => v.length >= 10 && v.length <= 11, "Celular inválido"),
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

/** Cabeçalhos exigidos pela API da Fruitfy (token + loja). */
function fruitfyHeaders() {
  return {
    Authorization: `Bearer ${process.env["FRUITFY_TOKEN"]!}`,
    "Store-Id": process.env["FRUITFY_STORE_ID"]!,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/** ID (UUID) do produto na Fruitfy para cada kit; cai no produto geral se não houver um específico. */
function fruitfyProductId(kit: KitId): string {
  const specific = process.env[`FRUITFY_PRODUCT_KIT${kit}`];
  const id = specific || process.env["FRUITFY_PRODUCT_ID"];
  if (!id) throw new Error("Produto da Fruitfy não configurado.");
  return id;
}

/**
 * A API pode devolver `error.detail` como string ou como objeto de
 * validação ({ campo: ["msg"] }). Normalizamos para uma frase legível.
 */
function extractError(payload: any, fallback: string): string {
  if (payload?.errors && typeof payload.errors === "object") {
    const msgs = Object.values(payload.errors).flat().map(String);
    if (msgs.length) return msgs.join(" • ");
  }
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

  const pix = payload?.pix ?? payload?.data?.pix ?? payload?.charge ?? payload ?? {};
  const code =
    pix.code ?? pix.qrcode ?? pix.qr_code ?? pix.copy_paste ?? pix.pix_code ?? pix.emv ?? pix.br_code ??
    payload?.qrcode ?? payload?.qr_code ?? null;
  let image = pix.qrcode_base64 ?? pix.qr_code_base64 ?? pix.qr_code_image ?? pix.image ?? null;
  // Se a API só devolver o código copia-e-cola, gera a imagem do QR a partir dele.
  if (!image && typeof code === "string" && code) {
    image = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(code)}`;
  }
  return { code: code as string | null, image: image as string | null };
}

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(async ({ data }) => {
    const kit = KITS[data.kit];
    const shipping = SHIPPING[data.shipping];
    const total = kit.amount + data.shippingAmount;
    const externalId = `udl-${data.kit}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const res = await fetch(`${BASE_URL}/pix/charge`, {
      method: "POST",
      headers: fruitfyHeaders(),
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.document,
        items: [{ id: fruitfyProductId(data.kit), value: total, quantity: 1 }],
        external_id: externalId,
      }),
    });

    const payload = await res.json().catch(() => ({}) as any);
    if (!res.ok) {
      console.error("[fruitfy] erro", res.status, JSON.stringify(payload));
      throw new Error(extractError(payload, "Não foi possível gerar o Pix agora."));
    }


    const body = payload?.data ?? payload;
    const { code, image } = pickPix(body);

    const chargeId = body?.order_id ?? body?.id ?? body?.uuid ?? null;
    return {
      externalId: chargeId ? String(chargeId) : externalId,
      id: chargeId,
      status: body?.status ?? "pending",
      amount: total,
      pixCode: code,
      pixImage: image,
    };
  });

export const getChargeStatus = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ externalId: z.string().min(3) }).parse(data))
  .handler(async ({ data }) => {
    const res = await fetch(`${BASE_URL}/order/${encodeURIComponent(data.externalId)}`, {
      headers: fruitfyHeaders(),
    });
    const payload = await res.json().catch(() => ({}) as any);
    const body = payload?.data ?? payload;
    return { status: (body?.status as string) ?? (body?.order?.status as string) ?? "pending" };
  });
