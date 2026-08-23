/* =============================================================
   Vigneshkumar Venugopal — portfolio behaviour
   Vanilla JS, no dependencies.
   ============================================================= */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Theme
     --------------------------------------------------------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('vk-theme'); } catch (e) {}
  if (stored) {
    root.setAttribute('data-theme', stored);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }

  $('#themeToggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('vk-theme', next); } catch (e) {}
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#fbfbfd' : '#0a0b0d');
  });

  /* ---------------------------------------------------------
     Nav: sticky state, scroll progress, active link, burger
     --------------------------------------------------------- */
  var nav = $('#nav');
  var bar = $('#scrollProgress');
  var sections = $$('main section[id]');
  var navLinks = $$('.nav__links a');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 24);

    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';

    var current = '';
    sections.forEach(function (s) {
      if (s.offsetTop - 140 <= y) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  var burger = $('#burger');
  var mobileMenu = $('#mobileMenu');
  burger.addEventListener('click', function () {
    var open = mobileMenu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#mobileMenu a').forEach(function (a) {
    a.addEventListener('click', function () {
      mobileMenu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  $('#toTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  $('#year').textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */
  var revealables = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------
     Project filtering
     --------------------------------------------------------- */
  var cards = $$('#projectGrid .proj');
  var empty = $('#gridEmpty');

  $$('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tag = btn.dataset.filter;
      $$('.filter').forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      var shown = 0;
      cards.forEach(function (c) {
        var match = tag === 'all' || c.dataset.tags.split(' ').indexOf(tag) !== -1;
        c.classList.toggle('is-hidden', !match);
        if (match) {
          shown++;
          c.classList.remove('is-in');
          // force reflow so the reveal transition replays
          void c.offsetWidth;
          c.classList.add('is-in');
        }
      });
      empty.hidden = shown !== 0;
    });
  });

  /* ---------------------------------------------------------
     Copy email
     --------------------------------------------------------- */
  var toast = $('#toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 2200);
  }

  var copyBtn = $('#copyEmail');
  copyBtn.addEventListener('click', function () {
    var email = copyBtn.dataset.email;
    var done = function () { showToast('Email copied — ' + email); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(done).catch(function () {
        window.location.href = 'mailto:' + email;
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = email;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { window.location.href = 'mailto:' + email; }
      document.body.removeChild(ta);
    }
  });

  /* ---------------------------------------------------------
     Command palette (⌘K / Ctrl+K)
     --------------------------------------------------------- */
  var COMMANDS = [
    { icon: '◈', label: 'Home',                      kind: 'section', href: '#home' },
    { icon: '◈', label: 'Profile / About',           kind: 'section', href: '#about' },
    { icon: '◈', label: 'Selected work',             kind: 'section', href: '#projects' },
    { icon: '◈', label: 'Experience',                kind: 'section', href: '#experience' },
    { icon: '◈', label: 'Publications',              kind: 'section', href: '#research' },
    { icon: '◈', label: 'Toolkit / Stack',           kind: 'section', href: '#stack' },
    { icon: '◈', label: 'Contact',                   kind: 'section', href: '#contact' },

    { icon: '▸', label: 'NeuralScholar — 3B fine-tuned research LLM',   kind: 'project', href: 'https://github.com/vignesh-kumar-v/NeuralScholar', ext: true },
    { icon: '▸', label: 'NanoLLM — transformer + CUDA kernels',         kind: 'project', href: 'https://github.com/vignesh-kumar-v/LLMs', ext: true },
    { icon: '▸', label: 'MLX-OCR-Unlimited — Apple Silicon OCR port',   kind: 'project', href: 'https://github.com/vignesh-kumar-v/mlx-ocr-unlimited', ext: true },
    { icon: '▸', label: 'Engram — hierarchical agent memory',           kind: 'project', href: 'https://github.com/vignesh-kumar-v/Engram', ext: true },
    { icon: '▸', label: 'PaperCut — ArXiv paper to PyTorch scaffold',   kind: 'project', href: 'https://github.com/vignesh-kumar-v/PaperCut', ext: true },
    { icon: '▸', label: 'FlashContext — on-demand RAG pipeline',        kind: 'project', href: 'https://github.com/vignesh-kumar-v/FlashContext', ext: true },
    { icon: '▸', label: 'TelcoFlow — churn MLOps pipeline',             kind: 'project', href: 'https://github.com/vignesh-kumar-v/TelcoFlow-CI-CD', ext: true },
    { icon: '▸', label: 'AEGIS — multi-agent flood response',           kind: 'project', href: 'https://github.com/vignesh-kumar-v/AEGIS-Multi-Agent-system', ext: true },
    { icon: '▸', label: 'VulnTriage-LLM — CVE severity triage',         kind: 'project', href: 'https://github.com/vignesh-kumar-v/VulnTriage-LLM', ext: true },
    { icon: '▸', label: 'CodeSentinel — self-healing code review',      kind: 'project', href: 'https://github.com/vignesh-kumar-v/codesentinel', ext: true },

    { icon: '¶', label: 'Paper — Transformer-LSTM for green hydrogen (Renewable Energy, 2025)', kind: 'paper', href: 'https://doi.org/10.1016/j.renene.2025.122369', ext: true },
    { icon: '¶', label: 'Paper — NSGA-II solar-biogas Kalina cycle (ECM, 2023)',                kind: 'paper', href: 'https://doi.org/10.1016/j.enconman.2023.117999', ext: true },

    { icon: '↗', label: 'GitHub — vignesh-kumar-v',  kind: 'link',   href: 'https://github.com/vignesh-kumar-v', ext: true },
    { icon: '↗', label: 'LinkedIn — in/vignesh5756', kind: 'link',   href: 'https://www.linkedin.com/in/vignesh5756', ext: true },
    { icon: '✉', label: 'Email — vvenug15@asu.edu',  kind: 'link',   href: 'mailto:vvenug15@asu.edu' },
    { icon: '☎', label: 'Phone — +1 623 570 2800',   kind: 'link',   href: 'tel:+16235702800' },
    { icon: '☾', label: 'Toggle light / dark theme', kind: 'action', action: function () { $('#themeToggle').click(); } }
  ];

  var palette = $('#palette');
  var pInput  = $('#paletteInput');
  var pList   = $('#paletteList');
  var results = [];
  var selected = 0;

  function render(query) {
    var q = query.trim().toLowerCase();
    results = q
      ? COMMANDS.filter(function (c) { return c.label.toLowerCase().indexOf(q) !== -1 || c.kind.indexOf(q) !== -1; })
      : COMMANDS.slice();
    selected = 0;
    pList.innerHTML = '';

    if (!results.length) {
      var none = document.createElement('li');
      none.className = 'palette__none';
      none.textContent = 'Nothing matches “' + query + '”.';
      pList.appendChild(none);
      return;
    }

    results.forEach(function (c, i) {
      var li = document.createElement('li');
      li.innerHTML = '<span class="p-ico">' + c.icon + '</span><span class="p-label"></span><span class="p-kind">' + c.kind + '</span>';
      li.querySelector('.p-label').textContent = c.label;
      if (i === 0) li.classList.add('is-sel');
      li.addEventListener('click', function () { run(c); });
      li.addEventListener('mousemove', function () { select(i); });
      pList.appendChild(li);
    });
  }

  function select(i) {
    var items = $$('li:not(.palette__none)', pList);
    if (!items.length) return;
    selected = (i + items.length) % items.length;
    items.forEach(function (el, n) { el.classList.toggle('is-sel', n === selected); });
    items[selected].scrollIntoView({ block: 'nearest' });
  }

  function run(cmd) {
    closePalette();
    if (cmd.action) { cmd.action(); return; }
    if (cmd.ext) { window.open(cmd.href, '_blank', 'noopener'); return; }
    if (cmd.href.charAt(0) === '#') {
      var target = $(cmd.href);
      if (target) target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', cmd.href);
    } else {
      window.location.href = cmd.href;
    }
  }

  function openPalette() {
    palette.hidden = false;
    document.body.style.overflow = 'hidden';
    pInput.value = '';
    render('');
    pInput.focus();
  }
  function closePalette() {
    palette.hidden = true;
    document.body.style.overflow = '';
  }

  $('#paletteOpen').addEventListener('click', openPalette);
  $$('[data-close]', palette).forEach(function (el) { el.addEventListener('click', closePalette); });
  pInput.addEventListener('input', function () { render(pInput.value); });

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.hidden ? openPalette() : closePalette();
      return;
    }
    if (palette.hidden) return;

    if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); select(selected + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); select(selected - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[selected]) run(results[selected]); }
  });

  /* ---------------------------------------------------------
     Hero: lightweight neural-network canvas
     --------------------------------------------------------- */
  var canvas = $('#neuralCanvas');
  if (canvas && !reduced) {
    var ctx = canvas.getContext('2d');
    var nodes = [];
    var W = 0, H = 0, dpr = 1;
    var pointer = { x: -9999, y: -9999 };
    var LINK = 148;

    function palette_() {
      var light = root.getAttribute('data-theme') === 'light';
      return light
        ? { node: 'rgba(53,99,233,',  link: 'rgba(53,99,233,' }
        : { node: 'rgba(120,160,255,', link: 'rgba(91,140,255,' };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var target = Math.min(78, Math.max(28, Math.round((W * H) / 15000)));
      nodes = [];
      for (var i = 0; i < target; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.5 + 0.9,
          p: Math.random() * Math.PI * 2
        });
      }
    }

    function frame(t) {
      var c = palette_();
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;

        // gentle pull toward the pointer
        var pdx = pointer.x - n.x, pdy = pointer.y - n.y;
        var pd2 = pdx * pdx + pdy * pdy;
        if (pd2 < 26000 && pd2 > 1) {
          var f = 0.00028;
          n.x += pdx * f; n.y += pdy * f;
        }

        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j];
          var dx = n.x - m.x, dy = n.y - m.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            var a = (1 - Math.sqrt(d2) / LINK) * 0.3;
            ctx.strokeStyle = c.link + a.toFixed(3) + ')';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        var pulse = 0.45 + 0.35 * Math.sin(t / 1400 + n.p);
        ctx.fillStyle = c.node + pulse.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(resize, 180);
    });
    window.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    }, { passive: true });
    window.addEventListener('pointerleave', function () { pointer.x = pointer.y = -9999; });

    resize();
    requestAnimationFrame(frame);
  }
})();
