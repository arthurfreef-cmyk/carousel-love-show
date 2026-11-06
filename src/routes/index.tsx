import { createFileRoute } from "@tanstack/react-router";
import { TestimonialCarousel, type Testimonial } from "@/components/TestimonialCarousel";
import { SiteFooter } from "@/components/SiteFooter";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import kit1Asset from "@/assets/kit1.webp.asset.json";
import kit3Asset from "@/assets/kit3.webp.asset.json";
import kit5Asset from "@/assets/kit5.webp.asset.json";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import { useEffect, useRef } from "react";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ultra D Lust — Tônico Antiqueda de Uso Diário" },
      {
        name: "description",
        content:
          "Ultra D Lust é um tônico de uso diário para o couro cabeludo. Rotina simples, aplicação direta na raiz. Conheça as condições disponíveis hoje.",
      },
      { property: "og:title", content: "Ultra D Lust — Tônico Antiqueda de Uso Diário" },
      {
        property: "og:description",
        content:
          "Tônico de uso diário para o couro cabeludo: aplicação prática, fórmula leve e foco na raiz.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const NAV_LINKS = [
  { href: "#beneficios", label: "Benefícios" },
  { href: "#como-usar", label: "Como usar" },
  { href: "#oferta", label: "Oferta" },
  { href: "#duvidas", label: "Dúvidas" },
] as const;

const BENEFITS = [
  {
    mark: "▣",
    title: "Aplicação direcionada",
    text: "Borrife diretamente no couro cabeludo, seguindo sempre as instruções do rótulo.",
  },
  {
    mark: "▲",
    title: "Rotina simples",
    text: "Um cuidado prático para incluir no dia a dia sem transformar sua rotina em um ritual complicado.",
  },
  {
    mark: "◉",
    title: "Foco na raiz",
    text: "Uma etapa dedicada ao cuidado do couro cabeludo e à aparência saudável dos fios.",
  },
] as const;

const STEPS = [
  { n: "01", title: "Divida o cabelo", text: "Separe o cabelo em partes para facilitar a aplicação." },
  {
    n: "02",
    title: "Aplique o tônico",
    text: "Borrife nas áreas desejadas do couro cabeludo, evitando o contato com os olhos.",
  },
  {
    n: "03",
    title: "Massageie suavemente",
    text: "Massageie com as pontas dos dedos e siga a frequência indicada no rótulo.",
  },
] as const;

const OFFERS = [
  {
    id: "checkout-1",
    kit: "1",
    badge: null as string | null,
    title: "1 Ultra D Lust",
    units: "1 frasco • 120 ml",
    image: kit1Asset.url,
    alt: "Um frasco do tônico Ultra D'Lust Original de 120 ml",
    reference: "R$ 39,90",
    price: "R$ 15,90",
    cta: "QUERO APROVEITAR POR R$ 15,90",
  },
  {
    id: "checkout-3",
    kit: "3",
    badge: "MAIS ESCOLHIDO",
    title: "Kit 3 Ultra D Lust",
    units: "3 frascos • 120 ml cada",
    image: kit3Asset.url,
    alt: "Kit com três frascos do tônico Ultra D'Lust Original de 120 ml",
    reference: "R$ 79,90",
    price: "R$ 29,90",
    cta: "QUERO MEU KIT COM 3",
  },
  {
    id: "checkout-5",
    kit: "5",
    badge: "MAIOR ECONOMIA",
    title: "Kit 5 Ultra D Lust",
    units: "5 frascos • 120 ml cada",
    image: kit5Asset.url,
    alt: "Kit com cinco frascos do tônico Ultra D'Lust Original de 120 ml",
    reference: "R$ 119,90",
    price: "R$ 49,90",
    cta: "QUERO A MAIOR ECONOMIA",
  },
] as const;


/*
  DEPOIMENTOS — conversas estilo WhatsApp.
  Edite os nomes, as fotos e as mensagens abaixo para trocar o conteúdo.
*/
const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rafael Oliveira",
    avatar: avatar1,
    time: "21:43",
    messages: [
      "mn para tudo q tu tá fazendo e me responde… tu viu meu cabelo agr???",
      "aquele buraco na entrada SUMIU. sumiu mn. 2 frascos do Ultra D Lust só",
      "joguei fora o boné q eu usava todo dia pra esconder. NUNCA MAIS 😤",
      "se tu conhece alguém sofrendo com queda, manda comprar isso AGORA",
    ],
  },
  {
    name: "Dudu Ferreira",
    avatar: avatar2,
    time: "19:07",
    messages: [
      "RAPAZ… lembra q eu te xinguei qnd vc me indicou esse tônico? kkkkk",
      "peço perdão oficialmente. as falhas tão FECHANDO, a queda PAROU de vez",
      "gastei dinheiro com tudo q é porcaria por anos e o negocio tava aqui",
      "já pedi o kit de 5. quem quiser ficar calvo q fique, eu tô fora 😂🔥",
    ],
  },
  {
    name: "Carlos Eduardo",
    avatar: avatar3,
    time: "12:26",
    messages: [
      "irmão, acordei hj, olhei no espelho e quase não acreditei",
      "barba fechada, cabelo encorpado, couro cabeludo nem aparece mais",
      "minha esposa falou q pareço outro homem. OUTRO HOMEM, tá ouvindo?",
      "virei garoto propaganda de graça, já convenci 3 cara aqui da firma 👊",
    ],
  },
];

const FAQ = [
  {
    q: "O Ultra D Lust é medicamento?",
    a: "Não. O Ultra D Lust é apresentado como um produto cosmético de uso tópico no couro cabeludo. Consulte a classificação e a regularização informadas no rótulo e nos documentos oficiais do fabricante.",
  },
  {
    q: "Como devo usar o produto?",
    a: "Siga o modo de uso indicado no rótulo e as instruções oficiais do fabricante. Não utilize de forma diferente da orientada na embalagem.",
  },
  {
    q: "Quando vou perceber resultados?",
    a: "A experiência pode variar de pessoa para pessoa. Não existe prazo fixo nem resultado garantido.",
  },
  {
    q: "Posso usar se a queda for intensa ou repentina?",
    a: "Em casos de queda intensa, súbita, localizada ou persistente, procure avaliação com um dermatologista antes de iniciar qualquer uso.",
  },
  {
    q: "O resultado é garantido?",
    a: "Não. A experiência varia conforme cada pessoa e o produto não deve ser apresentado como solução universal.",
  },
] as const;




function VslVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  // Mantém o som habilitado e encerra a reprodução exatamente aos 28 segundos.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = false;

    const stopAt28Seconds = () => {
      if (video.currentTime >= 28) {
        video.currentTime = 28;
        video.pause();
      }
    };

    video.addEventListener("timeupdate", stopAt28Seconds);
    return () => video.removeEventListener("timeupdate", stopAt28Seconds);
  }, []);

  return (
    <video
      ref={ref}
      src="/vsl-hero.mp4"
      controls
      playsInline
      className="mt-3 aspect-video w-full rounded-sm border border-border bg-black object-cover"
      poster="/vsl-poster.jpg"
      aria-label="Vídeo explicativo Ultra D Lust"
    />
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Aviso de Black Friday */}
      <div
        role="status"
        className="sticky top-0 z-50 border-b border-[#d6b45b]/40 bg-[#111111] px-4 py-3 text-center text-[#f5d77e]"
      >
        <p className="text-[11px] font-extrabold uppercase leading-snug tracking-[0.16em] md:text-xs">
          <span aria-hidden="true" className="mr-2">✦</span>
          Black Friday Ultra D Lust
          <span aria-hidden="true" className="mx-2">•</span>
          Confira os kits e ofertas disponíveis
          <span aria-hidden="true" className="ml-2">✦</span>
        </p>
      </div>

      {/* 2. Cabeçalho */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="block h-4 w-1.5 bg-foreground" aria-hidden="true" />
            <span className="text-sm font-extrabold uppercase tracking-[0.22em]">
              Ultra D Lust
            </span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <span className="hidden text-xs text-muted-foreground md:block">
            Tônico de uso diário • 120 ml
          </span>
        </div>
      </header>

      <main id="top">
        {/* 3. Hero */}
        <section className="mx-auto max-w-6xl px-5 py-10 md:py-24">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Rotina direta para o couro cabeludo
              </p>
              <h1 className="mt-4 text-3xl font-extrabold leading-[1.08] sm:text-4xl md:text-6xl">
                Pare de ter quedas de cabelo com o Ultra D Lust
              </h1>
              <p className="mt-3 max-w-xl text-base font-semibold leading-snug text-primary md:text-lg">
                O melhor tônico feito para reduzir em 90% a queda de cabelos, tratar a calvície e
                acelerar o crescimento do cabelo e à barba.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:mt-6 md:text-lg">
                O Ultra D Lust é um tônico de uso diário criado para entrar na sua rotina de
                cuidados com o couro cabeludo e ajudar a reduzir a quebra, deixando o cuidado
                dos fios mais simples e consistente.
              </p>

              <ul className="mt-6 space-y-2.5 border-t border-border pt-5 md:mt-8 md:space-y-3 md:pt-6">
                {[
                  "Aplicação prática diretamente no couro cabeludo.",
                  "Fórmula leve para uma rotina sem complicação.",
                  "Cuidado diário focado na raiz e na aparência saudável dos fios.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm md:text-base">
                    <span aria-hidden="true" className="mt-2 block h-1.5 w-1.5 shrink-0 bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Imagem oficial do produto */}
              <img
                src="/hero.png"
                alt="Frasco do tônico Ultra D'Lust Original de 120 ml"
                width={960}
                height={960}
                loading="eager"
                className="mx-auto h-80 w-auto object-contain sm:h-96 md:h-[28rem]"
              />

              {/* VSL — antes do primeiro CTA */}
              <div className="mt-6 md:mt-8">
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Assista antes de escolher seu kit
                </p>
                <VslVideo />
              </div>

              {/* Bloco de compra — primeiro CTA da página */}
              <div className="mt-6 border border-border bg-card p-5 md:mt-8 md:p-6">

                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Tônico Ultra D&apos;Lust Original • 120 ml
                </p>
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <span className="text-sm text-muted-foreground line-through">R$ 39,90</span>
                  <span className="text-3xl font-extrabold text-primary">R$ 15,90</span>
                </div>
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  Oferta especial: escolha seu kit e aproveite o preço promocional enquanto esta condição estiver disponível.
                </p>
                <div className="mt-4 flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-2.5">
                  <span aria-hidden="true" className="text-lg">🛡️</span>
                  <span className="text-xs font-bold uppercase tracking-wide text-primary">
                    60 dias de garantia de reembolso
                  </span>
                </div>
                <a
                  href="#oferta"
                  className="mt-6 block bg-primary px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-85"
                >
                  Escolher meu kit
                </a>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Compra segura • Consulte condições de envio, troca e garantia
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* 4. Identificação do problema */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-24">
            <h2 className="text-2xl font-extrabold leading-tight md:text-4xl">
              Fios no ralo, na escova e no travesseiro não precisam ser ignorados.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Quando a quebra e a queda começam a chamar atenção, o pior caminho é continuar
              adiando o cuidado. O Ultra D Lust foi pensado para transformar o cuidado do couro
              cabeludo em um passo simples, rápido e consistente dentro da rotina.
            </p>
          </div>
          <div className="bg-ink px-5 py-10 text-center text-ink-foreground">
            <p className="mx-auto max-w-3xl text-xl font-bold md:text-3xl">
              O primeiro passo é parar de deixar para depois.
            </p>
          </div>
        </section>

        {/* 5. Benefícios */}
        <section id="beneficios" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h2 className="text-2xl font-extrabold md:text-4xl">Um cuidado objetivo, sem ritual.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {BENEFITS.map((b) => (
              <article key={b.title} className="border border-border p-7">
                <span aria-hidden="true" className="text-2xl">
                  {b.mark}
                </span>
                <h3 className="mt-5 text-lg font-bold">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 6. Como usar */}
        <section id="como-usar" className="bg-ink text-ink-foreground">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
            <h2 className="text-2xl font-extrabold md:text-4xl">Como usar</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {STEPS.map((s) => (
                <article key={s.n}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-foreground text-sm font-bold text-ink">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-75">{s.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-12 border-t border-white/15 pt-6 text-xs leading-relaxed opacity-60">
              Faça teste de sensibilidade conforme as orientações do fabricante. Em caso de
              irritação, interrompa o uso.
            </p>
          </div>
        </section>

        {/* 7. Oferta */}
        <section id="oferta" className="border-y border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
                <span aria-hidden="true">✦</span>
                Condição especial por tempo limitado
              </span>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight md:text-5xl">
                Leve mais unidades, aproveite o preço especial e comece sua rotina hoje.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Compare os kits, escolha o que faz sentido para você e aproveite os valores promocionais. Quanto maior o kit, mais frascos você leva em um único pedido.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-2"><span className="text-primary">✓</span> Frascos de 120 ml</span>
                <span className="inline-flex items-center gap-2"><span className="text-primary">✓</span> Escolha seu kit</span>
                <span className="inline-flex items-center gap-2"><span className="text-primary">✓</span> Garantia de 60 dias</span>
              </div>
            </div>

            <div className="mt-10 grid items-stretch gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
              {OFFERS.map((o) => (
                <article
                  key={o.id}
                  className={`relative flex flex-col overflow-hidden rounded-sm border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:p-7 ${o.kit === "3" ? "border-2 border-primary shadow-xl md:-translate-y-2 md:hover:-translate-y-3" : "border-border"}`}
                >
                  {o.badge ? (
                    <span className={`mb-4 inline-flex min-h-7 items-center self-start px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${o.kit === "3" ? "bg-primary text-primary-foreground" : "bg-foreground/5 text-foreground"}`}>
                      {o.badge}
                    </span>
                  ) : (
                    <span className="mb-4 inline-flex min-h-7 items-center self-start px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Comece por aqui
                    </span>
                  )}
                  <div className="flex min-h-56 items-center justify-center rounded-sm bg-background/70 px-3">
                    <img
                      src={o.image}
                      alt={o.alt}
                      width={800}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 768px) 320px, 90vw"
                      className="h-52 w-full object-contain"
                    />
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-extrabold">{o.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{o.units}</p>
                  </div>
                  <div className="mt-6 rounded-sm bg-secondary/70 p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      De <span className="line-through">{o.reference}</span> por
                    </p>
                    <p className="mt-1 text-4xl font-extrabold tracking-tight text-primary">{o.price}</p>
                  </div>
                  <a
                    href={`/checkout?kit=${o.kit}`}
                    className={`mt-6 block w-full px-5 py-4 text-center text-xs font-extrabold uppercase tracking-[0.12em] transition-all hover:brightness-95 ${o.kit === "3" ? "bg-primary text-primary-foreground shadow-md" : "border border-primary bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground"}`}
                  >
                    {o.cta}
                  </a>
                  <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
                    Você poderá conferir os dados do pedido antes de finalizar.
                  </p>
                </article>
              ))}
            </div>

            {/* Garantia de 60 dias */}
            <div className="mx-auto mt-8 flex max-w-4xl items-start gap-4 rounded-sm border border-primary/30 bg-card p-5 md:mt-10 md:p-6">
              <span aria-hidden="true" className="shrink-0 text-2xl text-primary">🛡️</span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
                  Garantia de 60 dias
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Você tem 60 dias de garantia de reembolso para avaliar sua compra com tranquilidade. Se decidir que não é para você, solicite o reembolso conforme as condições da garantia.
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Preço de referência riscado versus preço promocional informado. Consulte condições
              de envio, troca e garantia antes de finalizar a compra.
            </p>
          </div>
        </section>

        {/* 8. Prova social — carrossel automático */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-4xl px-5 py-16 md:py-24">
            <h2 className="text-2xl font-extrabold md:text-4xl">
              Quem usou, conta como foi.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Conversas reais de clientes avaliando o Ultra D Lust no dia a dia.
            </p>
            <TestimonialCarousel items={TESTIMONIALS} intervalMs={6000} className="mx-auto mt-10 max-w-2xl" />
          </div>
        </section>

        {/* 9. FAQ */}
        <section id="duvidas" className="mx-auto max-w-3xl px-5 py-16 md:py-24">
          <h2 className="text-2xl font-extrabold md:text-4xl">Dúvidas frequentes</h2>
          <Accordion type="single" collapsible className="mt-8 border-t border-border">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-b border-border">
                <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* 10. CTA final */}
        <section className="bg-ink text-ink-foreground">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
            <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
              Pare de adiar o cuidado da raiz.
            </h2>
            <p className="mt-5 text-base opacity-75 md:text-lg">
              Comece sua rotina com Ultra D Lust.
            </p>
            <a
              href="#oferta"
              className="mt-9 inline-block w-full bg-ink-foreground px-10 py-4 text-sm font-bold uppercase tracking-[0.14em] text-ink transition-opacity hover:opacity-85 sm:w-auto"
            >
              Quero começar agora
            </a>
          </div>
        </section>
      </main>

      {/* 11. Rodapé */}
      <SiteFooter />

    </div>
  );
}
