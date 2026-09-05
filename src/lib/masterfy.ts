declare global {
  interface Window {
    MasterFy?: {
      init: (pk: string) => Promise<void>;
      encrypt: (card: {
        number: string;
        holder: string;
        expMonth: number | string;
        expYear: number | string;
        cvv: string;
      }) => Promise<string>;
    };
  }
}

const SCRIPT_SRC = "https://api.masterfypagamentos.com/v1/scripts";

let scriptPromise: Promise<void> | null = null;
let initializedKey: string | null = null;

function waitForSdk(timeoutMs = 8000): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      if (window.MasterFy) return resolve();
      if (Date.now() - started > timeoutMs)
        return reject(new Error("Pagamento por cartão indisponível no momento."));
      setTimeout(tick, 50);
    };
    tick();
  });
}

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Somente no navegador"));
  if (window.MasterFy) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!existing) {
      const script = document.createElement("script");
      // O SDK é um ES module (usa `import`), precisa de type="module".
      script.type = "module";
      script.src = SCRIPT_SRC;
      script.addEventListener("error", () =>
        reject(new Error("Falha ao carregar o pagamento por cartão")),
      );
      document.head.appendChild(script);
    }
    // O módulo define window.MasterFy ao executar; aguardamos a global.
    waitForSdk().then(resolve, reject);
  }).catch((err) => {
    scriptPromise = null;
    throw err;
  });

  return scriptPromise;
}

export async function tokenizeCard(
  publicKey: string,
  card: { number: string; holderName: string; expMonth: number; expYear: number; cvv: string },
): Promise<string> {
  if (!publicKey) throw new Error("Pagamento por cartão indisponível no momento.");
  await loadScript();
  const sdk = window.MasterFy;
  if (!sdk) throw new Error("Pagamento por cartão indisponível no momento.");
  if (initializedKey !== publicKey) {
    await sdk.init(publicKey);
    initializedKey = publicKey;
  }
  return sdk.encrypt({
    number: card.number,
    holder: card.holderName,
    expMonth: String(card.expMonth).padStart(2, "0"),
    expYear: String(card.expYear).length === 2 ? `20${card.expYear}` : String(card.expYear),
    cvv: card.cvv,
  });
}

export function prefetchMasterfy() {
  void loadScript().catch(() => {
    /* ignorado */
  });
}
