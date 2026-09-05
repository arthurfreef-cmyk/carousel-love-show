import { useCallback, useEffect, useRef, useState, type ComponentProps } from "react";
import { Camera, ChevronLeft, ChevronRight, Mic, Phone, Smile, Video } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  /** Nome exibido no topo da conversa. */
  name: string;
  /** Foto de perfil estilo WhatsApp. */
  avatar: string;
  /** Mensagens do cliente avaliando o produto. */
  messages: string[];
  /** Horário exibido nas mensagens (ex.: "21:43"). */
  time: string;
}

export interface TestimonialCarouselProps extends ComponentProps<"div"> {
  items: Testimonial[];
  /** Intervalo de troca automática em milissegundos. */
  intervalMs?: number;
}


/**
 * Carrossel de depoimentos em formato de conversa de WhatsApp.
 * Avanço automático, pausa no hover/foco e botões para trocar de 1 em 1.
 */
export function TestimonialCarousel({
  items,
  intervalMs = 6000,
  className,
  ...props
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = items.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (paused || total <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, Math.max(1500, intervalMs));

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, total, intervalMs]);

  if (total === 0) return null;

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carrossel"
      aria-label="Depoimentos de clientes"
      {...props}
    >
      <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item, i) => (
            <article
              key={item.name + i}
              className="w-full shrink-0"
              aria-hidden={i !== index}
            >
              {/* Tela de conversa estilo WhatsApp (tema escuro) */}
              <div className="flex flex-col bg-[#0b141a]">
                {/* Barra superior */}
                <div className="flex items-center gap-3 bg-[#202c33] px-4 py-3">
                  <img
                    src={item.avatar}
                    alt={`Foto de perfil de ${item.name}`}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#e9edef]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#8696a0]">online</p>
                  </div>
                  <div className="flex items-center gap-5 text-[#aebac1]">
                    <Video className="h-5 w-5" aria-hidden="true" />
                    <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
                  </div>
                </div>

                {/* Área de mensagens */}
                <div className="flex min-h-[220px] flex-col justify-end gap-2 bg-[#0b141a] px-4 py-5 md:min-h-[240px]">
                  <p className="mx-auto mb-2 rounded-lg bg-[#182229] px-3 py-1 text-[11px] text-[#8696a0]">
                    hoje
                  </p>
                  {item.messages.map((message, j) => (
                    <div
                      key={j}
                      className="max-w-[85%] self-start rounded-lg rounded-tl-none bg-[#202c33] px-3 py-2 shadow-sm"
                    >
                      <p className="text-sm leading-snug text-[#e9edef]">{message}</p>
                      <div className="mt-1 flex items-center justify-end gap-1">
                        <span className="text-[10px] text-[#8696a0]">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Barra de envio de mensagem */}
                <div className="flex items-center gap-2 bg-[#202c33] px-3 py-2">
                  <div className="flex flex-1 items-center gap-3 rounded-full bg-[#2a3942] px-4 py-2.5">
                    <Smile className="h-5 w-5 shrink-0 text-[#8696a0]" aria-hidden="true" />
                    <span className="flex-1 truncate text-sm text-[#8696a0]">Mensagem</span>
                    <Camera className="h-5 w-5 shrink-0 text-[#8696a0]" aria-hidden="true" />
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-[#111b21]">
                    <Mic className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Controles: 1 em 1 */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {items.map((item, i) => (
            <button
              key={`dot-${item.name}-${i}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir para o depoimento ${i + 1} (${item.name})`}
              aria-current={i === index}
              className={cn(
                "h-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground",
                i === index ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground",
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Depoimento anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Próximo depoimento"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
