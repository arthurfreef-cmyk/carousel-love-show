import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/termos-de-compra")({
  head: () => ({
    meta: [
      { title: "Termos de Compra — Ultra D Lust" },
      {
        name: "description",
        content:
          "Leia os termos e condições de compra do Ultra D Lust antes de finalizar seu pedido.",
      },
      { property: "og:title", content: "Termos de Compra — Ultra D Lust" },
      {
        property: "og:description",
        content: "Leia os termos e condições de compra do Ultra D Lust antes de finalizar seu pedido.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsOfPurchasePage,
});

function TermsOfPurchasePage() {
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
        <h1 className="text-3xl font-extrabold md:text-4xl">Termos de Compra</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground">1. Aceitação</h2>
            <p className="mt-3">
              Ao finalizar um pedido em nosso site, você declara que leu e concorda com estes
              Termos de Compra, bem como com a Política de Privacidade e a Política de Troca e
              Devolução.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">2. Produto</h2>
            <p className="mt-3">
              O Ultra D Lust é um produto cosmético de uso tópico no couro cabeludo, conforme
              informações do rótulo e do fabricante. Não se trata de medicamento nem de tratamento
              médico.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">3. Pagamento</h2>
            <p className="mt-3">
              Aceitamos pagamento via Pix, processado pelo gateway BuckPay. O pedido é confirmado
              após a confirmação do pagamento pela instituição financeira.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">4. Preços e promoções</h2>
            <p className="mt-3">
              Os preços exibidos são em reais (R$) e podem ser alterados sem aviso prévio. Promoções
              são válidas enquanto durarem os estoques ou o período informado na oferta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">5. Entrega</h2>
            <p className="mt-3">
              O prazo de entrega começa a contar após a confirmação do pagamento e varia de acordo
              com a região e a modalidade de frete escolhida. O endereço informado é de
              responsabilidade do comprador.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">6. Cancelamento</h2>
            <p className="mt-3">
              O comprador pode solicitar o cancelamento antes da confirmação de envio. Após o envio,
              as regras de troca e devolução devem ser observadas.
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
