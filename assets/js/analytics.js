/* -----------------------------------------------------------------
   Cloudflare Web Analytics loader.

   The site token lives here and nowhere else — index.html, 404.html
   and every /r/<tag>/ link page load this one file.

   To enable: paste your token between the quotes below.
   dash.cloudflare.com → Web Analytics → your site → Manage site → JS snippet
   (the token is the value of "token" inside the data-cf-beacon attribute)

   While TOKEN is empty this file does nothing at all — no requests,
   no cookies, no console noise.
   ----------------------------------------------------------------- */
(function () {
  'use strict';

  var TOKEN = '5f357c447055485b8aeeb3c72e11e0b7';

  if (!TOKEN) return;

  // Respect Do Not Track. Cloudflare is cookieless either way, but this
  // costs nothing and is the polite default.
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token: TOKEN }));
  document.head.appendChild(s);
})();
