import Script from 'next/script'

const TAWK_SRC = 'https://embed.tawk.to/69b930092e21981c396ad079/1jjtm79q5'

export function TawkWidget() {
  return (
    <Script id="tawk-embed" strategy="afterInteractive">
      {`
        (function () {
          if (window.__druporiaTawkLoaded) return;
          window.__druporiaTawkLoaded = true;

          var originalConsoleError = console.error;
          console.error = function () {
            try {
              var stack = arguments[0] && arguments[0].stack ? arguments[0].stack : '';
              var callerStack = new Error().stack || '';
              var text = Array.prototype.join.call(arguments, ' ');
              var combined = String(stack) + ' ' + String(callerStack) + ' ' + String(text);
              if (
                combined.indexOf('embed.tawk.to') !== -1 ||
                combined.indexOf('twk-chunk-common') !== -1 ||
                combined.indexOf('twk-chunk-vendors') !== -1 ||
                combined.indexOf('va.tawk.to/log-performance') !== -1
              ) {
                return;
              }
            } catch (error) {}
            return originalConsoleError.apply(console, arguments);
          };

          var originalFetch = window.fetch;
          function isBlockedTawkPerformanceRequest(value) {
            try {
              if (!value) return false;
              if (typeof value === 'string') {
                return value.indexOf('va.tawk.to/log-performance') !== -1;
              }
              if (value.url) {
                return String(value.url).indexOf('va.tawk.to/log-performance') !== -1;
              }
              return String(value).indexOf('va.tawk.to/log-performance') !== -1;
            } catch (error) {
              return false;
            }
          }

          window.fetch = function (input, init) {
            try {
              if (isBlockedTawkPerformanceRequest(input) || isBlockedTawkPerformanceRequest(init)) {
                return Promise.resolve(new Response(null, { status: 204 }));
              }
            } catch (error) {}
            return originalFetch.apply(this, arguments);
          };

          if (navigator.sendBeacon) {
            var originalSendBeacon = navigator.sendBeacon.bind(navigator);
            navigator.sendBeacon = function (url, data) {
              if (isBlockedTawkPerformanceRequest(url)) return true;
              return originalSendBeacon(url, data);
            };
          }

          var originalXHROpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function (method, url) {
            this.__druporiaBlockedTawkPerformance = isBlockedTawkPerformanceRequest(url);
            return originalXHROpen.apply(this, arguments);
          };

          var originalXHRSend = XMLHttpRequest.prototype.send;
          XMLHttpRequest.prototype.send = function () {
            if (this.__druporiaBlockedTawkPerformance) return;
            return originalXHRSend.apply(this, arguments);
          };

          function isOptionalEmojiScript(node) {
            try {
              return (
                node &&
                node.tagName === 'SCRIPT' &&
                String(node.src || '').indexOf('cdn.jsdelivr.net/emojione') !== -1
              );
            } catch (error) {
              return false;
            }
          }

          var originalAppendChild = Node.prototype.appendChild;
          Node.prototype.appendChild = function (node) {
            if (isOptionalEmojiScript(node)) return node;
            return originalAppendChild.apply(this, arguments);
          };

          var originalInsertBefore = Node.prototype.insertBefore;
          Node.prototype.insertBefore = function (node) {
            if (isOptionalEmojiScript(node)) return node;
            return originalInsertBefore.apply(this, arguments);
          };

          window.Tawk_API = window.Tawk_API || {};
          window.Tawk_API.customStyle = {
            visibility: {
              desktop: {
                position: 'br',
                xOffset: 24,
                yOffset: 24
              },
              mobile: {
                position: 'br',
                xOffset: 16,
                yOffset: 16
              }
            }
          };
          function keepTawkCompact() {
            try {
              var frames = document.querySelectorAll('iframe');
              for (var i = 0; i < frames.length; i++) {
                var frame = frames[i];
                var src = frame.getAttribute('src') || '';
                var title = frame.getAttribute('title') || '';
                var isTawkFrame = src.indexOf('tawk.to') !== -1 || title.toLowerCase().indexOf('chat widget') !== -1;

                if (!isTawkFrame) continue;

                var rect = frame.getBoundingClientRect();
                var isExpanded = rect.width > 420 || rect.height > 620;

                if (isExpanded && window.innerWidth >= 768) {
                  frame.style.setProperty('position', 'fixed', 'important');
                  frame.style.setProperty('top', 'auto', 'important');
                  frame.style.setProperty('left', 'auto', 'important');
                  frame.style.setProperty('right', '24px', 'important');
                  frame.style.setProperty('bottom', '24px', 'important');
                  frame.style.setProperty('width', '380px', 'important');
                  frame.style.setProperty('height', '560px', 'important');
                  frame.style.setProperty('max-width', 'calc(100vw - 48px)', 'important');
                  frame.style.setProperty('max-height', 'calc(100vh - 48px)', 'important');
                  frame.style.setProperty('border-radius', '20px', 'important');
                  frame.style.setProperty('box-shadow', '0 24px 80px rgba(15, 23, 42, 0.22)', 'important');
                  frame.style.setProperty('overflow', 'hidden', 'important');
                }
              }
            } catch (error) {}
          }

          var compactObserver = new MutationObserver(keepTawkCompact);
          compactObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
          });
          window.addEventListener('resize', keepTawkCompact);
          window.setInterval(keepTawkCompact, 1000);
          window.Tawk_LoadStart = new Date();

          var s1 = document.createElement('script');
          var s0 = document.getElementsByTagName('script')[0];
          s1.async = true;
          s1.src = '${TAWK_SRC}';
          s1.charset = 'UTF-8';
          s1.setAttribute('crossorigin', '*');
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  )
}
