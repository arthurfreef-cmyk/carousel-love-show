import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/politica-de-troca-e-devolucao")({
  head: () => ({
    meta: [
      { title: "Política de Troca e Devolução — Ultra D Lust" },
      {
        name: "description",
        content:
          "Entenda como funciona a troca, devolução e garantia do Ultra D Lust.",
      },
      { property: "og:title", content: "Política de Troca e Devolução — Ultra D Lust" },
      {
        property: "og:description",
        content: "Entenda como funciona a troca, devolução e garantia do Ultra D Lust.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReturnPolicyPage,
});

function ReturnPolicyPage() {
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
        <h1 className="text-3xl font-extrabold md:text-4xl">Política de Troca e Devolução</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground">1. Garantia de 30 dias</h2>
            <p className="mt-3">
              Oferecemos garantia de 30 dias a partir da entrega. Se você não ficar satisfeito com o
              produto, pode solicitar a devolução dentro desse prazo, conforme as condições abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">2. Condições para devolução</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>O produto deve estar na embalagem original.</li>
              <li>O frasco não pode estar vazio ou com uso excessivo.</li>
              <li>É necessário informar o número do pedido e o motivo da devolução.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">3. Como solicitar</h2>
            <p className="mt-3">
              Envie um e-mail para o canal de atendimento indicado na página de SAC com o assunto
              “Solicitação de devolução”, informando número do pedido, nome completo e motivo.
              Responderemos em até 7 dias úteis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">4. Reembolso</h2>
            <p className="mt-3">
              Após a análise e aprovação, o reembolso será feito pelo mesmo meio de pagamento
              utilizado na compra (Pix), em até 10 dias úteis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">5. Produtos avariados</h2>
            <p className="mt-3">
              Se o produto chegar avariado ou com a embalagem violada, recuse o recebimento ou
              entre em contato em até 48 horas após a entrega, enviando fotos do pacote e do
              produto.
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
