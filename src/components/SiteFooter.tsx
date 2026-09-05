import { Link } from "@tanstack/react-router";

const FOOTER_LINKS = [
  { label: "Política de privacidade", to: "/politica-de-privacidade" },
  { label: "Termos de compra", to: "/termos-de-compra" },
  { label: "Política de troca e devolução", to: "/politica-de-troca-e-devolucao" },
  { label: "Atendimento/SAC", to: "/atendimento-sac" },
] as const;


export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-center gap-2.5">
          <span className="block h-4 w-1.5 bg-ink-foreground" aria-hidden="true" />
          <span className="text-sm font-extrabold uppercase tracking-[0.22em]">Ultra D Lust</span>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed opacity-70">
          Tônico capilar de uso diário para o couro cabeludo. Aplicação direta na raiz,
          fórmula leve e rotina simples de cuidado com os fios.
        </p>
        <nav className="mt-8 flex flex-wrap gap-x-8 gap-y-3" aria-label="Links institucionais">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm opacity-75 transition-opacity hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <dl className="mt-10 grid gap-4 border-t border-white/10 pt-8 text-xs opacity-60 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["CNPJ", "46.713.522/0001-31"],
            ["Fabricante", "Ultra D Lust Cosméticos LTDA"],
            ["Composição", "Conforme rótulo da embalagem"],
            ["Lote e validade", "Impressos na embalagem do produto"],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="font-semibold uppercase tracking-[0.14em]">{term}</dt>
              <dd className="mt-1">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-xs leading-relaxed opacity-50">
          © {new Date().getFullYear()} Ultra D Lust. Todos os direitos reservados. Este produto
          não substitui avaliação médica. Em caso de queda intensa ou persistente, procure um
          dermatologista.
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;
