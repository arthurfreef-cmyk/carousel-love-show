import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, MessageCircle, Clock } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/atendimento-sac")({
  head: () => ({
    meta: [
      { title: "Atendimento/SAC — Ultra D Lust" },
      {
        name: "description",
        content:
          "Fale com o atendimento da Ultra D Lust. Tire dúvidas sobre pedidos, entregas, trocas e devoluções.",
      },
      { property: "og:title", content: "Atendimento/SAC — Ultra D Lust" },
      {
        property: "og:description",
        content: "Fale com o atendimento da Ultra D Lust. Tire dúvidas sobre pedidos, entregas, trocas e devoluções.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar para o início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 md:py-20">
        <h1 className="text-3xl font-extrabold md:text-4xl">Atendimento/SAC</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Estamos prontos para ajudar com dúvidas sobre pedidos, pagamentos, entregas, trocas e
          devoluções.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <a
            href="mailto:sac@ultralust.shop"
            className="flex flex-col gap-3 rounded-sm border border-border bg-card p-6 transition-colors hover:border-primary/60"
          >
            <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-bold text-foreground">E-mail</h2>
              <p className="mt-1 text-sm text-muted-foreground">sac@ultralust.shop</p>
            </div>
          </a>

          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-3 rounded-sm border border-border bg-card p-6 transition-colors hover:border-primary/60"
          >
            <MessageCircle className="h-6 w-6 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-bold text-foreground">WhatsApp</h2>
              <p className="mt-1 text-sm text-muted-foreground">(11) 99999-9999</p>
            </div>
          </a>

          <div className="flex flex-col gap-3 rounded-sm border border-border bg-card p-6 sm:col-span-2">
            <Clock className="h-6 w-6 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-bold text-foreground">Horário de atendimento</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Segunda a sexta, das 9h às 18h (exceto feriados). Respostas por e-mail em até 24h
                úteis.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground">Antes de falar conosco</h2>
            <p className="mt-3">
              Para agilizar seu atendimento, tenha em mãos o número do pedido e o e-mail usado no
              checkout. Assim conseguimos localizar sua compra rapidamente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">Prazo de resposta</h2>
            <p className="mt-3">
              Respondemos mensagens por WhatsApp em horário comercial e e-mails em até 1 dia útil.
              Demandas sobre devolução seguem o prazo descrito na Política de Troca e Devolução.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-85"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar para a página inicial
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
