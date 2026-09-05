import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Ultra D Lust" },
      {
        name: "description",
        content:
          "Saiba como a Ultra D Lust coleta, usa e protege seus dados pessoais.",
      },
      { property: "og:title", content: "Política de Privacidade — Ultra D Lust" },
      {
        property: "og:description",
        content: "Saiba como a Ultra D Lust coleta, usa e protege seus dados pessoais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-extrabold md:text-4xl">Política de Privacidade</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground">1. Dados que coletamos</h2>
            <p className="mt-3">
              Coletamos apenas as informações necessárias para processar seu pedido e entregar seu
              produto: nome completo, CPF, e-mail, CEP e endereço completo. Esses dados são
              fornecidos por você no checkout.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">2. Como usamos seus dados</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Processar pagamentos via Pix e gerar nota fiscal quando necessário.</li>
              <li>Enviar seu pedido para o endereço informado.</li>
              <li>Entrar em contato sobre entrega, troca ou devolução.</li>
              <li>Melhorar a experiência de navegação e rastrear campanhas de marketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">3. Compartilhamento</h2>
            <p className="mt-3">
              Compartilhamos dados apenas com prestadores de serviço essenciais: gateway de pagamento
              (BuckPay), transportadoras e ferramentas de análise de tráfego. Não vendemos seus
              dados a terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">4. Cookies e rastreamento</h2>
            <p className="mt-3">
              Utilizamos cookies e tecnologias similares para entender como você chegou até a loja,
              medir anúncios e melhorar a navegação. Você pode desativar cookies no seu navegador,
              mas algumas funções do site podem ser limitadas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">5. Segurança</h2>
            <p className="mt-3">
              Adotamos práticas de segurança para proteger suas informações, incluindo comunicação
              criptografada (HTTPS) e acesso restrito aos dados internamente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">6. Seus direitos</h2>
            <p className="mt-3">
              Você pode solicitar acesso, correção ou exclusão dos seus dados entrando em contato
              pelo e-mail de atendimento indicado na página de SAC.
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
