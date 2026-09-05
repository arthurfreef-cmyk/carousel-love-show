import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import {
  KITS,
  SHIPPING,
  createPixCharge,
  getChargeStatus,
  type KitId,
  type ShippingId,
} from "@/lib/checkout.functions";
import { SiteFooter } from "@/components/SiteFooter";
import { ShieldCheck, Lock, Zap } from "lucide-react";

import { sendCapiEvent } from "@/lib/meta-capi.functions";
import {
  getMetaCookies,
  newEventId,
  trackAddPaymentInfo,
  trackInitiateCheckout,
  trackPurchase,
} from "@/lib/meta-pixel";
import kit1Asset from "@/assets/kit1.webp.asset.json";
import kit3Asset from "@/assets/kit3.webp.asset.json";
import kit5Asset from "@/assets/kit5.webp.asset.json";

const KIT_IMAGES: Record<KitId, { url: string; alt: string }> = {
  "1": { url: kit1Asset.url, alt: "Um frasco do tônico Ultra D'Lust Original de 120 ml" },
  "3": { url: kit3Asset.url, alt: "Kit com três frascos do tônico Ultra D'Lust Original de 120 ml" },
  "5": { url: kit5Asset.url, alt: "Kit com cinco frascos do tônico Ultra D'Lust Original de 120 ml" },
};

// Frete grátis: o valor cobrado é exatamente o preço do kit exibido na oferta.
const SHIPPING_FEES: Record<ShippingId, number> = { standard: 0, express: 0 };

function loadShippingFees(): Record<ShippingId, number> {
  return SHIPPING_FEES;
}

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): { kit: KitId } => {
    const kit = String(search['kit'] ?? "1");
    return { kit: (kit === "3" || kit === "5" ? kit : "1") as KitId };
  },
  head: () => ({
    meta: [
      { title: "Checkout Pix • Ultra D Lust" },
      {
        name: "description",
        content:
          "Finalize seu pedido do tônico Ultra D Lust em poucos campos: CEP automático e pagamento via Pix.",
      },
      { property: "og:title", content: "Checkout Pix • Ultra D Lust" },
      {
        property: "og:description",
        content: "Pedido rápido do tônico Ultra D Lust com CEP automático e Pix instantâneo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const input =
  "w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";
const label = "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

type Charge = Awaited<ReturnType<typeof createPixCharge>>;

function maskCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

function CheckoutPage() {
  const { kit } = Route.useSearch();
  const selected = KITS[kit];
  const submit = useServerFn(createPixCharge);
  const checkStatus = useServerFn(getChargeStatus);
  const sendCapi = useServerFn(sendCapiEvent);

  const [form, setForm] = useState({
    name: "",
    email: "",
    document: "",
    zipcode: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    number: "",
  });
  const [shipping, setShipping] = useState<ShippingId>("standard");
  const [fees, setFees] = useState<Record<ShippingId, number> | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charge, setCharge] = useState<Charge | null>(null);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const numberRef = useRef<HTMLInputElement>(null);
  const orderIdRef = useRef<string | null>(null);


  useEffect(() => {
    setFees(loadShippingFees());
  }, []);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));


  const addressReady = Boolean(form.city);
  const formatBRL = (cents: number) =>
    (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const shippingAmount = fees?.[shipping] ?? 0;
  const shippingPrice = formatBRL(shippingAmount);
  const total = selected.amount + shippingAmount;
  const savings =
    (parseInt(selected.reference.replace(/\D/g, ""), 10) || 0) - selected.amount;

  // Meta: InitiateCheckout ao abrir o checkout (Pixel + CAPI com deduplicação)
  useEffect(() => {
    const eventId = newEventId();
    const value = selected.amount / 100;
    const payload = {
      eventId,
      value,
      contentName: selected.label,
      contentIds: [`ultra-d-lust-${kit}`],
    };
    trackInitiateCheckout(payload);
    const cookies = getMetaCookies();
    void sendCapi({
      data: {
        eventName: "InitiateCheckout",
        sourceUrl: window.location.href,
        userAgent: navigator.userAgent,
        ...cookies,
        ...payload,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kit]);

  // Meta: Purchase quando o Pix é confirmado (Pixel + CAPI com dados hasheados)
  const purchaseSentRef = useRef(false);
  useEffect(() => {
    if (!paid || purchaseSentRef.current) return;
    purchaseSentRef.current = true;
    const orderId = charge?.externalId ?? orderIdRef.current;
    const eventId = orderId ? `purchase-${orderId}` : newEventId();
    const value = total / 100;
    const payload = {
      eventId,
      value,
      orderId: orderId ?? undefined,

      contentName: selected.label,
      contentIds: [`ultra-d-lust-${kit}`],
    };
    trackPurchase(payload);
    const cookies = getMetaCookies();
    void sendCapi({
      data: {
        eventName: "Purchase",
        sourceUrl: window.location.href,
        userAgent: navigator.userAgent,
        email: form.email,
        name: form.name,
        document: form.document,
        zipcode: form.zipcode,
        city: form.city,
        state: form.state,
        ...cookies,
        ...payload,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid]);

  // CEP automático (ViaCEP)
  useEffect(() => {
    const digits = form.zipcode.replace(/\D/g, "");
    if (digits.length !== 8) return;
    let cancelled = false;
    setCepLoading(true);
    setCepError(null);
    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.erro) {
          setCepError("CEP não encontrado.");
          return;
        }
        setForm((f) => ({
          ...f,
          street: d.logradouro ?? "",
          neighborhood: d.bairro ?? "",
          city: d.localidade ?? "",
          state: d.uf ?? "",
        }));
        numberRef.current?.focus();
      })
      .catch(() => !cancelled && setCepError("Não foi possível buscar o CEP."))
      .finally(() => !cancelled && setCepLoading(false));
    return () => {
      cancelled = true;
    };
  }, [form.zipcode]);

  // Confirmação automática do pagamento
  useEffect(() => {
    if (!charge || paid) return;
    const timer = setInterval(async () => {
      try {
        const r = await checkStatus({ data: { externalId: charge.externalId } });
        if (["paid", "approved", "completed", "processed"].includes(String(r.status).toLowerCase())) {
          setPaid(true);
        }
      } catch {
        /* silencioso */
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [charge, paid, checkStatus]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const paymentEventId = newEventId();
      const payload = {
        eventId: paymentEventId,
        value: total / 100,
        contentName: selected.label,
        contentIds: [`ultra-d-lust-${kit}`],
      };
      trackAddPaymentInfo(payload);
      void sendCapi({
        data: {
          eventName: "AddPaymentInfo",
          sourceUrl: window.location.href,
          userAgent: navigator.userAgent,
          email: form.email,
          name: form.name,
          document: form.document,
          zipcode: form.zipcode,
          city: form.city,
          state: form.state,
          ...getMetaCookies(),
          ...payload,
        },
      });
      const result = await submit({ data: { kit, shipping, shippingAmount, ...form } });
      setCharge(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar o Pix.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link to="/" className="text-sm font-bold uppercase tracking-[0.2em]">
            Ultra D Lust
          </Link>
          <Link
            to="/"
            className="text-xs font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8 md:py-12">
        <h1 className="text-2xl font-extrabold md:text-3xl">Finalize seu pedido</h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Ambiente seguro — pagamento via Pix com confirmação instantânea
        </p>

        <div className="relative mt-5 flex items-center justify-between gap-4 overflow-hidden border border-primary/30 bg-card p-5">
          <div className="absolute left-0 top-0 h-full w-1 bg-primary" aria-hidden="true" />
          <div className="flex items-center gap-4 pl-2">
            <img
              src={KIT_IMAGES[kit].url}
              alt={KIT_IMAGES[kit].alt}
              width={96}
              height={96}
              loading="eager"
              className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
            />
            <div>
              <p className="text-sm font-bold">{selected.label}</p>
              <p className="text-xs text-muted-foreground">{selected.units}</p>
              <p className="mt-1.5 inline-block bg-primary/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                Você economiza {formatBRL(savings)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground line-through">{selected.reference}</p>
            <p className="text-2xl font-extrabold text-primary">{selected.price}</p>
            {addressReady ? (
              <p className="mt-1 text-xs text-muted-foreground">
                + {shippingPrice} de frete • total {formatBRL(total)}
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">Frete calculado após o CEP</p>
            )}
          </div>
        </div>

        {paid ? (
          <div className="mt-8 border border-primary bg-card p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-3 text-xl font-extrabold text-primary">Pagamento confirmado!</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Recebemos seu pagamento. Você receberá os detalhes do envio por e-mail.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Voltar ao site
            </Link>
          </div>
        ) : charge ? (
          <div className="mt-8 border border-border bg-card p-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-lg font-bold">Pague com Pix para concluir</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Abra o app do seu banco, escaneie o QR Code ou copie o código abaixo.
            </p>
            {charge.pixImage ? (
              <img
                src={
                  charge.pixImage.startsWith("data:")
                    ? charge.pixImage
                    : `data:image/png;base64,${charge.pixImage}`
                }
                alt="QR Code Pix do pedido"
                className="mx-auto mt-5 h-56 w-56 bg-white p-2"
              />
            ) : null}
            {charge.pixCode ? (
              <>
                <p className="mt-5 break-all border border-border bg-background p-4 text-left text-xs">
                  {charge.pixCode}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(charge.pixCode!);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="mt-4 w-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground"
                >
                  {copied ? "Código copiado" : "Copiar código Pix"}
                </button>
              </>
            ) : null}
            <p className="mt-4 text-xs text-muted-foreground">
              Assim que o pagamento cair, esta página confirma automaticamente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <h2 className="flex items-center gap-2.5 text-sm font-extrabold uppercase tracking-[0.14em]">
                <span className="flex h-6 w-6 items-center justify-center bg-primary text-xs font-extrabold text-primary-foreground">1</span>
                Seus dados
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={label} htmlFor="name">Nome completo</label>
                <input id="name" required className={`${input} mt-2`} value={form.name}
                  onChange={(e) => set("name", e.target.value)} autoComplete="name" />
              </div>
              <div>
                <label className={label} htmlFor="email">E-mail</label>
                <input id="email" type="email" required className={`${input} mt-2`} value={form.email}
                  onChange={(e) => set("email", e.target.value)} autoComplete="email" />
              </div>
              <div>
                <label className={label} htmlFor="document">CPF</label>
                <input id="document" required inputMode="numeric" className={`${input} mt-2`} value={form.document}
                  onChange={(e) => set("document", e.target.value)} placeholder="000.000.000-00" />
              </div>
              <div className="sm:col-span-2 mt-2">
                <h2 className="flex items-center gap-2.5 text-sm font-extrabold uppercase tracking-[0.14em]">
                  <span className="flex h-6 w-6 items-center justify-center bg-primary text-xs font-extrabold text-primary-foreground">2</span>
                  Entrega
                </h2>
              </div>
              <div>
                <label className={label} htmlFor="zipcode">CEP</label>
                <input id="zipcode" required inputMode="numeric" className={`${input} mt-2`} value={form.zipcode}
                  onChange={(e) => set("zipcode", maskCep(e.target.value))} autoComplete="postal-code"
                  placeholder="00000-000" />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {cepLoading ? "Buscando endereço..." : cepError ?? "Endereço preenchido automaticamente."}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="street">Endereço</label>
                <input id="street" required readOnly={!!form.street} className={`${input} mt-2`} value={form.street}
                  onChange={(e) => set("street", e.target.value)} />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {form.city ? `${form.neighborhood} • ${form.city}/${form.state}` : "Informe o CEP acima."}
                </p>
              </div>
              <div>
                <label className={label} htmlFor="number">Número</label>
                <input id="number" required ref={numberRef} className={`${input} mt-2`} value={form.number}
                  onChange={(e) => set("number", e.target.value)} />
              </div>
            </div>

            {addressReady ? (
              <fieldset className="border border-border bg-card p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <legend className={`${label} px-1`}>Escolha o frete</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {(Object.keys(SHIPPING) as ShippingId[]).map((id) => {
                    const option = SHIPPING[id];
                    const active = shipping === id;
                    return (
                      <label
                        key={id}
                        className={`relative flex cursor-pointer items-center justify-between gap-4 border p-4 transition-all ${
                          active
                            ? "border-primary bg-primary/5 shadow-[0_0_0_1px_var(--primary)]"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {id === "standard" ? (
                          <span className="absolute -top-2.5 left-3 bg-primary px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground">
                            Mais escolhido
                          </span>
                        ) : null}
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={id}
                            checked={active}
                            onChange={() => setShipping(id)}
                            className="h-4 w-4 accent-[var(--primary)]"
                          />
                          <span>
                            <span className="block text-sm font-bold">{option.label}</span>
                            <span className="block text-xs text-muted-foreground">{option.eta}</span>
                          </span>
                        </span>
                        <span className="text-sm font-bold text-primary">{formatBRL(fees?.[id] ?? 0)}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            <div>
              <h2 className="flex items-center gap-2.5 text-sm font-extrabold uppercase tracking-[0.14em]">
                <span className="flex h-6 w-6 items-center justify-center bg-primary text-xs font-extrabold text-primary-foreground">3</span>
                Pagamento
              </h2>
            </div>

            <div className="flex items-center gap-3 border border-primary bg-primary/5 p-4">
              <input
                type="radio"
                name="method"
                checked
                readOnly
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <Zap className="h-4 w-4 text-primary" />
              <span>
                <span className="block text-sm font-bold">Pix</span>
                <span className="block text-xs text-muted-foreground">Aprovação na hora</span>
              </span>
            </div>

            {error ? (
              <p className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2.5 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-primary-foreground transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                "Gerando Pix..."
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Pagar {formatBRL(total)} com Pix
                </>
              )}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" /> Compra 100% segura
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" /> Pix aprovado na hora
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Dados usados só para o envio
              </span>
            </div>
          </form>
        )}
        <div className="mt-8">
          <Link
            to="/"
            className="text-xs font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
