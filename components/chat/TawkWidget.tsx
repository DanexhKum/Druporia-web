import Script from 'next/script'

const TAWK_SRC = 'https://embed.tawk.to/69b930092e21981c396ad079/1jjtm79q5'

// ============================================================
// Tawk.to live chat.
//
// An earlier version of this file patched console.error,
// window.fetch, navigator.sendBeacon, XMLHttpRequest.prototype
// and — most dangerously — Node.prototype.appendChild /
// insertBefore, in order to suppress noise from Tawk's optional
// emojione CDN script and its performance beacon.
//
// Those patches are gone. Overriding Node.prototype globally
// affects React's own DOM writes and every other script on the
// page, which is a far worse failure mode than the console noise
// they existed to hide.
//
// Expect some noise back: dropping cdn.jsdelivr.net from the CSP
// means Tawk's optional emojione script is refused, and the
// browser logs that refusal. Tawk's performance beacon still
// runs. Neither affects the widget. If the console matters,
// filter it in devtools — not by patching global prototypes.
//
// Sizing is handled through Tawk's own customStyle API rather
// than by polling getBoundingClientRect on every iframe.
// ============================================================

export function TawkWidget() {
  return (
    <Script id="tawk-embed" strategy="afterInteractive">
      {`
        (function () {
          if (window.__druporiaTawkLoaded) return;
          window.__druporiaTawkLoaded = true;

          window.Tawk_API = window.Tawk_API || {};
          window.Tawk_API.customStyle = {
            visibility: {
              desktop: { position: 'br', xOffset: 24, yOffset: 24 },
              mobile:  { position: 'br', xOffset: 16, yOffset: 16 }
            }
          };
          window.Tawk_LoadStart = new Date();

          var s1 = document.createElement('script');
          var s0 = document.getElementsByTagName('script')[0];
          s1.async = true;
          s1.src = '${TAWK_SRC}';
          s1.charset = 'UTF-8';
          s1.crossOrigin = 'anonymous';
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  )
}
