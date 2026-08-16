/* =========================================================
   Tania Vital, consultora educacional UniBF
   Organizado em modulos independentes. Cada um se registra no
   arranque e, quando faz sentido, expoe pin() e unpin(), que o
   modulo de movimento reduzido chama nos dois sentidos.
   ========================================================= */
(function () {
  "use strict";

  /* =======================================================
     1. CONSTANTES
     ======================================================= */

  var WHATSAPP = "5567999021267";

  var VIDEO = {
    ready: true,
    src: "assets/hero-scrub.mp4",
    poster: "assets/img/hero-poster.jpg",
    bytes: 6622482
  };

  /* Os cinco portoes do heroi estatico. A lista e a unica fonte da
     verdade: o JS decide e escreve html.scrub, e o CSS so obedece.
     Sem JS, o padrao continua sendo o heroi estatico, que e completo. */
  var GATES = [
    "(max-width: 720px)",
    "(orientation: portrait) and (max-width: 1024px)",
    "(orientation: portrait) and (pointer: coarse)",
    "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
    "(prefers-reduced-motion: reduce)"
  ];
  var GATE_REDUCED = 4;

  var HERO_LERP = 0.16;      // suavizacao do scrub por quadro de 60fps
  var HOLD_UP_MS = 2200;     // tempo para completar o caminho segurando
  var HOLD_DOWN_MS = 900;    // tempo para o progresso voltar ao soltar
  var STAGGER_MS = 1100;     // ate aposentar os atrasos de entrada

  /* =======================================================
     2. UTILIDADES
     ======================================================= */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  function smoothstep(p, edge0, edge1) {
    // bordas iguais dariam divisao por zero, e em p igual a borda daria NaN,
    // que envenenaria a opacidade da primeira e da ultima faixa
    if (edge1 === edge0) return p < edge0 ? 0 : 1;
    var t = clamp((p - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  var HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) { return HTML_ESCAPES[c]; });
  }

  function docTop(el) { return el.getBoundingClientRect().top + window.scrollY; }

  var reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* =======================================================
     3. METRICAS DE LAYOUT
     Ler getBoundingClientRect a cada rolagem custa caro no
     celular simples, que e o aparelho do publico dela. Aqui as
     medidas sao lidas uma vez e so refeitas quando algo muda.
     ======================================================= */

  var metrics = {
    main: { top: 0, span: 1 },
    hero: { top: 0, span: 1 }
  };

  function measureLayout() {
    var main = $("#main");
    var hero = $(".hero");
    if (main) {
      metrics.main.top = docTop(main);
      metrics.main.span = Math.max(1, main.offsetHeight - window.innerHeight);
    }
    if (hero) {
      metrics.hero.top = docTop(hero);
      metrics.hero.span = Math.max(1, hero.offsetHeight - window.innerHeight);
    }
  }

  function progressThrough(box) {
    return clamp((window.scrollY - box.top) / box.span, 0, 1);
  }

  /* =======================================================
     4. ROLAGEM COMPARTILHADA
     Um unico ouvinte, para nao existirem tres lendo layout ao
     mesmo tempo. Cada modulo assina e desassina quando precisa.
     ======================================================= */

  var scrollSubs = [];
  var scrolling = false;

  function onScroll() {
    for (var i = 0; i < scrollSubs.length; i++) scrollSubs[i]();
  }
  function subscribeScroll(fn) {
    if (scrollSubs.indexOf(fn) === -1) scrollSubs.push(fn);
    if (!scrolling) {
      scrolling = true;
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }
  function unsubscribeScroll(fn) {
    var i = scrollSubs.indexOf(fn);
    if (i !== -1) scrollSubs.splice(i, 1);
  }

  /* =======================================================
     5. WHATSAPP
     Cada botao carrega a acao no data-wa e ganha a mensagem
     completa, marcada pela origem que veio no endereco. O href
     ja vem escrito no HTML, entao os botoes funcionam mesmo se
     o JS falhar: aqui eles so sao melhorados.
     ======================================================= */

  var whatsapp = (function () {
    function originPhrase() {
      var raw = new URLSearchParams(location.search).get("origem");
      if (!raw) return "Vim pela sua página e";
      var clean = raw.replace(/[^a-zA-Z0-9\- ]/g, "").slice(0, 40).toLowerCase();
      if (!clean) return "Vim pela sua página e";
      if (clean === "folheto") return "Vim pelo folheto e";
      if (clean.indexOf("folheto-") === 0) {
        return "Vim pelo folheto de " + clean.slice(8).replace(/-/g, " ") + " e";
      }
      return "Vim de " + clean.replace(/-/g, " ") + " e";
    }

    var phrase = originPhrase();

    function href(action) {
      var msg = "Olá Tania! " + phrase + " " + action + ".";
      return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
    }

    function init() {
      $$("[data-wa]").forEach(function (el) {
        el.href = href(el.getAttribute("data-wa"));
        el.target = "_blank";
        el.rel = "noopener";
      });
    }

    return { init: init, href: href };
  })();

  /* =======================================================
     6. CABECALHO
     A altura real vira --hdr, e o heroi do celular dimensiona
     por ela: assim o botao do WhatsApp nunca cai abaixo da
     dobra em aparelho nenhum.
     ======================================================= */

  var header = (function () {
    var el, lastHeight = -1, hasShadow = false;

    function measure() {
      if (!el) return;
      var h = Math.round(el.getBoundingClientRect().height);
      if (h === lastHeight) return;
      lastHeight = h;
      document.documentElement.style.setProperty("--hdr", h + "px");
    }

    function paintShadow() {
      if (!el) return;
      var want = window.scrollY > 8;
      if (want === hasShadow) return;
      hasShadow = want;
      el.style.boxShadow = want ? "0 6px 22px rgba(46,27,13,.08)" : "none";
    }

    function init() {
      el = $(".hdr");
      if (!el) return;
      measure();
      paintShadow();
      subscribeScroll(paintShadow);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    }

    return { init: init, onResize: measure };
  })();

  /* =======================================================
     7. MENU DO CELULAR
     ======================================================= */

  var menu = (function () {
    function init() {
      var burger = $(".burger"), nav = $(".mnav");
      if (!burger || !nav) return;

      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });

      $$("a", nav).forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }
    return { init: init };
  })();

  /* =======================================================
     8. O CAMINHO DOURADO
     O elemento de assinatura: um traco que se desenha na
     margem conforme a pagina avanca.
     ======================================================= */

  var trail = (function () {
    var el, last = -1;

    function draw() {
      if (!el) return;
      var v = Math.round(progressThrough(metrics.main) * 200) / 200;
      if (v === last) return;
      last = v;
      el.style.setProperty("--draw", v);
    }

    function init() {
      el = $(".trail");
      if (!el) return;
      draw();
      subscribeScroll(draw);
    }

    return {
      init: init,
      onResize: function () { last = -1; draw(); },
      pin: function () { if (el) el.style.setProperty("--draw", 1); },
      unpin: function () { last = -1; draw(); }
    };
  })();

  /* =======================================================
     9. CATALOGO DE CURSOS
     Abas por categoria e uma busca que atravessa todas elas.
     ======================================================= */

  var catalog = (function () {
    var tabsWrap, panel, search, activeId;

    function courseRow(course, category, withMeta) {
      var action = "quero saber mais sobre o curso de " + course +
                   " (" + category.label + ", " + category.duration + ")";
      return '<li class="crow">' +
               '<span class="crow__n">' + escapeHtml(course) +
                 (withMeta
                   ? '<span class="crow__meta">' + escapeHtml(category.label) +
                     " · " + escapeHtml(category.duration) + "</span>"
                   : "") +
               "</span>" +
               '<a class="crow__go" href="' + whatsapp.href(action) + '" target="_blank" rel="noopener">' +
                 'Fale comigo<svg aria-hidden="true"><use href="#i-go"/></svg>' +
               "</a>" +
             "</li>";
    }

    function emptyRow() {
      return '<li class="cempty">Nenhum curso encontrado com esse termo. Tente outra palavra ou ' +
             '<a href="' + whatsapp.href("não encontrei o curso que procuro na sua página, pode me ajudar") +
             '" target="_blank" rel="noopener">fale comigo direto</a>.</li>';
    }

    function head(title, sub, stamp) {
      return '<div class="ticket__head"><div>' +
               "<h3>" + escapeHtml(title) + "</h3>" +
               '<div class="dur">' + escapeHtml(sub) + "</div>" +
             "</div>" +
             '<div class="ticket__stamp">' + escapeHtml(stamp) + "</div></div>";
    }

    function paintTabs() {
      $$(".tab", tabsWrap).forEach(function (b) {
        b.classList.toggle("on", b.dataset.id === activeId);
      });
    }

    function paintCategory(category) {
      panel.innerHTML =
        head(category.label,
             "Duração " + category.duration + " · " + category.courses.length + " cursos",
             category.tag) +
        (category.note ? '<p class="ticket__note">' + escapeHtml(category.note) + "</p>" : "") +
        '<ul class="clist">' +
          category.courses.map(function (c) { return courseRow(c, category, false); }).join("") +
        "</ul>";
    }

    function paintSearch(query) {
      var needle = query.trim().toLowerCase();
      var hits = [];
      COURSE_CATEGORIES.forEach(function (category) {
        // a Segunda Graduacao repete o catalogo inteiro, entao ficaria duplicada
        if (category.id === "segunda-graduacao") return;
        category.courses.forEach(function (course) {
          if (course.toLowerCase().indexOf(needle) !== -1) {
            hits.push({ course: course, category: category });
          }
        });
      });

      panel.innerHTML =
        head('Resultados para "' + query + '"',
             hits.length + " curso(s) encontrado(s)", "BUSCA") +
        (hits.length
          ? '<p class="ticket__note">Esses cursos também estão disponíveis pela Segunda Graduação, para quem já tem diploma.</p>'
          : "") +
        '<ul class="clist">' +
          (hits.length
            ? hits.map(function (h) { return courseRow(h.course, h.category, true); }).join("")
            : emptyRow()) +
        "</ul>";
    }

    function categoryById(id) {
      return COURSE_CATEGORIES.filter(function (c) { return c.id === id; })[0];
    }

    function selectCategory(category) {
      activeId = category.id;
      if (search) search.value = "";
      paintTabs();
      paintCategory(category);
    }

    function init() {
      tabsWrap = $("#catTabs");
      panel = $("#ticket");
      search = $("#catSearch");
      if (!tabsWrap || !panel || typeof COURSE_CATEGORIES === "undefined") return;

      activeId = COURSE_CATEGORIES[0].id;

      COURSE_CATEGORIES.forEach(function (category) {
        var b = document.createElement("button");
        b.className = "tab" + (category.id === activeId ? " on" : "");
        b.type = "button";
        b.dataset.id = category.id;
        b.innerHTML = escapeHtml(category.label) +
                      ' <span class="n">' + escapeHtml(category.duration) + "</span>";
        b.addEventListener("click", function () { selectCategory(category); });
        tabsWrap.appendChild(b);
      });

      // links de secao que ja abrem numa aba especifica
      $$("[data-tab]").forEach(function (link) {
        link.addEventListener("click", function () {
          var category = categoryById(link.getAttribute("data-tab"));
          if (category) selectCategory(category);
        });
      });

      if (search) {
        search.addEventListener("input", function () {
          var q = search.value;
          if (q.trim() === "") {
            paintTabs();
            paintCategory(categoryById(activeId));
          } else {
            paintSearch(q);
          }
        });
      }

      paintCategory(COURSE_CATEGORIES[0]);
    }

    return { init: init };
  })();

  /* =======================================================
     10. PERGUNTAS FREQUENTES
     ======================================================= */

  var faq = (function () {
    function openHeight(answer) {
      answer.style.maxHeight = "none";
      var h = answer.scrollHeight;
      answer.style.maxHeight = h + "px";
    }

    function close(item) {
      item.classList.remove("open");
      $(".fitem__a", item).style.maxHeight = null;
      $(".fitem__q", item).setAttribute("aria-expanded", "false");
    }

    function init() {
      $$(".fitem").forEach(function (item) {
        var button = $(".fitem__q", item);
        var answer = $(".fitem__a", item);

        button.addEventListener("click", function () {
          var wasOpen = item.classList.contains("open");
          $$(".fitem.open").forEach(function (other) {
            if (other !== item) close(other);
          });
          if (wasOpen) {
            close(item);
          } else {
            item.classList.add("open");
            button.setAttribute("aria-expanded", "true");
            openHeight(answer);
          }
        });
      });
    }

    // girar o aparelho remede a resposta aberta, que senao fica cortada
    function onResize() {
      var item = $(".fitem.open");
      if (item) openHeight($(".fitem__a", item));
    }

    return { init: init, onResize: onResize };
  })();

  /* =======================================================
     11. O MOMENTO INTERATIVO
     Segure o botao e percorra os quatro passos ate o diploma.
     ======================================================= */

  var pathHold = (function () {
    var button, box, label, steps = [];
    var progress = 0, holding = false, raf = null, lastFrame = 0;
    var litCount = -1, finished = false;
    var THRESHOLDS = [0.16, 0.40, 0.64, 0.90];

    function markFinished() {
      finished = true;
      box.classList.add("done");
      label.textContent = "Feito";
    }

    function paint() {
      button.style.setProperty("--hp", progress.toFixed(3));

      var lit = 0;
      for (var i = 0; i < THRESHOLDS.length; i++) {
        if (progress >= THRESHOLDS[i]) lit = i + 1;
      }
      if (lit !== litCount) {
        litCount = lit;
        steps.forEach(function (step, i) { step.classList.toggle("lit", i < lit); });
      }

      if (progress >= 0.999 && !finished) markFinished();
    }

    function tick(now) {
      var dt = Math.min(100, now - (lastFrame || now));
      lastFrame = now;
      var speed = holding ? 1 / HOLD_UP_MS : -1 / HOLD_DOWN_MS;
      progress = clamp(progress + dt * speed, 0, 1);
      paint();

      var running = holding ? progress < 1 : progress > 0;
      if (running) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
        lastFrame = 0;
      }
    }

    function start(e) {
      if (finished) return;
      if (e && e.cancelable) e.preventDefault();
      holding = true;
      if (raf === null) raf = requestAnimationFrame(tick);
    }

    function stop() {
      if (finished) return;          // concluido nao volta atras
      holding = false;
      if (raf === null && progress > 0) raf = requestAnimationFrame(tick);
    }

    function init() {
      button = $("#holdBtn");
      box = $("#hold");
      if (!button || !box) return;
      label = $("i", button);
      steps = $$(".pstep");

      button.addEventListener("pointerdown", start);
      button.addEventListener("pointerleave", stop);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
      button.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Enter") start(e);
      });
      button.addEventListener("keyup", stop);
    }

    return {
      init: init,
      pin: function () {
        if (!button) return;
        holding = false;
        if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
        progress = 1;
        litCount = -1;
        paint();        // acende as quatro etapas
        markFinished(); // e so entao tranca, para o rotulo e a classe entrarem
      },
      unpin: function () {
        if (!button) return;
        finished = false;
        progress = 0;
        litCount = -1;
        box.classList.remove("done");
        label.textContent = "Segure";
        paint();
      }
    };
  })();

  /* =======================================================
     12. ENTRADAS DE SECAO
     ======================================================= */

  var reveals = (function () {
    var observer = null;

    function showAll() {
      $$(".rv, .stg").forEach(function (el) { el.classList.add("in", "done"); });
    }

    function init() {
      var items = $$(".rv, .stg");
      if (!items.length) return;
      if (!("IntersectionObserver" in window)) { showAll(); return; }

      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add("in");
          observer.unobserve(el);
          // aposenta os atrasos escalonados, senao todo hover depois fica lento
          if (el.classList.contains("stg")) {
            setTimeout(function () { el.classList.add("done"); }, STAGGER_MS);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

      items.forEach(function (el) { observer.observe(el); });
    }

    // nao existe unpin: reesconder conteudo ja revelado seria pior
    return { init: init, pin: showAll };
  })();

  /* =======================================================
     13. BOTAO FLUTUANTE
     Recolhe quando outro botao principal ja esta na tela, para
     nao existirem dois botoes verdes iguais competindo.
     ======================================================= */

  var floatingButton = (function () {
    function init() {
      var button = $(".wafloat");
      var anchors = $$(".hero-static__cta, .band--settle .btn, .final .btn");
      if (!button || !anchors.length || !("IntersectionObserver" in window)) return;

      var visible = new WeakMap();
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { visible.set(e.target, e.isIntersecting); });
        var anyVisible = anchors.some(function (el) { return visible.get(el) === true; });
        button.classList.toggle("tucked", anyVisible);
      }, { threshold: 0.35 });

      anchors.forEach(function (el) { observer.observe(el); });
    }
    return { init: init };
  })();

  /* =======================================================
     14. HEROI COM SCRUB
     O video avanca com a rolagem. Busca em Blob, lerp normalizado
     por tempo, seeks com portao e escrita no DOM so na mudanca.
     ======================================================= */

  var heroScrub = (function () {
    var video, stage, ring, poster, bands = [];
    var target = 0, shown = 0, raf = null, lastFrame = 0;
    var seekBusy = false, pendingSeek = null;
    var heroVisible = false, active = false, loadStarted = false;
    var introK = 0, introStart = 0;
    var mqls = [], previewOverride = false;

    /* ---- seeks: nunca dois ao mesmo tempo, e sem travar ---- */
    function requestSeek(time) {
      if (!video || !video.duration) return;
      if (seekBusy) { pendingSeek = time; return; }
      seekBusy = true;
      video.currentTime = time;
    }

    /* ---- faixas de legenda ---- */
    function paintBands(p) {
      bands.forEach(function (band, i) {
        var fade = Math.min(0.02, (band.b - band.a) / 3);
        var fadeIn = i === 0 ? 0 : fade;                    // a primeira abre assentada
        var fadeOut = i === bands.length - 1 ? 0 : fade;    // a ultima nao some
        var opacity = smoothstep(p, band.a, band.a + fadeIn) *
                      (1 - smoothstep(p, band.b - fadeOut, band.b));

        var ramp = Math.min(0.025, (band.b - band.a) * 0.35);
        var k = clamp((p - band.a) / ramp, 0, 1);
        if (i === 0) k = Math.max(k, introK);

        var opQ = Math.round(opacity * 100) / 100;
        var kQ = Math.round(k * 125) / 125;
        if (opQ !== band.opacity) { band.opacity = opQ; band.el.style.opacity = opQ; }
        if (kQ !== band.k) { band.k = kQ; band.el.style.setProperty("--k", kQ); }
      });
    }

    /* ---- laco que descansa quando converge ---- */
    function tick(now) {
      var dt = Math.min(100, now - (lastFrame || now));
      lastFrame = now;
      shown += (target - shown) * (1 - Math.pow(1 - HERO_LERP, dt / 16.667));

      if (introK < 1 && introStart) introK = clamp((now - introStart) / 900, 0, 1);

      var converged = Math.abs(target - shown) < 0.0005 && introK >= 1;
      if (converged) shown = target;

      if (video && video.duration) requestSeek(shown * video.duration);
      paintBands(shown);

      if (converged) { raf = null; lastFrame = 0; }
      else { raf = requestAnimationFrame(tick); }
    }

    function wake() {
      if (raf !== null || !active || !heroVisible) return;
      lastFrame = 0;
      raf = requestAnimationFrame(tick);
    }

    function follow() {
      target = progressThrough(metrics.hero);
      wake();
    }

    /* ---- carga do video em Blob, com anel de progresso ---- */
    function fail() {
      if (stage) stage.classList.add("video-failed");
    }

    function loadBlob() {
      var controller = new AbortController();
      var watchdog = setTimeout(function () { controller.abort(); }, 20000);

      return fetch(VIDEO.src, { priority: "low", signal: controller.signal })
        .then(function (res) {
          if (!res.ok) throw new Error("http " + res.status);
          var total = Number(res.headers.get("Content-Length")) || VIDEO.bytes || 1;
          var reader = res.body.getReader();
          var chunks = [], received = 0, lastPaint = 0;

          function pump() {
            return reader.read().then(function (r) {
              if (r.done) return;
              clearTimeout(watchdog);
              watchdog = setTimeout(function () { controller.abort(); }, 20000);

              chunks.push(r.value);
              received += r.value.length;

              var frac = Math.min(1, received / total);
              var now = performance.now();
              if (ring && (now - lastPaint > 100 || frac === 1)) {
                lastPaint = now;
                ring.style.setProperty("--ld", Math.round(126 * (1 - frac)));
              }
              return pump();
            });
          }

          return pump().then(function () {
            clearTimeout(watchdog);
            if (ring) ring.style.setProperty("--ld", 0);
            video.src = URL.createObjectURL(new Blob(chunks));
            video.load();
            video.addEventListener("canplay", function () {
              requestSeek(progressThrough(metrics.hero) * video.duration);
              stage.classList.add("video-ready");
            }, { once: true });
          });
        });
    }

    function startLoading() {
      if (loadStarted) return;
      loadStarted = true;
      if (poster) poster.style.backgroundImage = "url('" + VIDEO.poster + "')";

      // o poster ganha a corrida de banda de proposito: so depois dele o video comeca
      var kicked = false;
      function kick() {
        if (kicked) return;
        kicked = true;
        loadBlob().catch(fail);
      }
      var img = new Image();
      img.onload = kick;
      img.onerror = kick;
      img.src = VIDEO.poster;
      setTimeout(kick, 4000);
    }

    /* ---- ligar e desligar ---- */
    function enable() {
      if (active || !VIDEO.ready) return;
      active = true;
      document.documentElement.classList.add("scrub");
      measureLayout();                 // a altura do heroi acabou de mudar
      startLoading();
      introStart = performance.now();
      introK = 0;
      subscribeScroll(follow);
      bands.forEach(function (b) { b.opacity = -1; b.k = -1; });
      paintBands(progressThrough(metrics.hero));
      follow();
    }

    function disable() {
      if (!active) return;
      active = false;
      document.documentElement.classList.remove("scrub");
      unsubscribeScroll(follow);
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      measureLayout();
    }

    function apply() {
      var blocked = mqls.some(function (mq, i) {
        // ?video=1 e so para a Tania conferir quando o Windows dela esta com
        // animacoes desligadas. Ignora apenas o portao de movimento reduzido,
        // nunca os de tamanho e de toque: video em celular continua proibido.
        if (previewOverride && i === GATE_REDUCED) return false;
        return mq.matches;
      });
      if (blocked) disable();
      else enable();
    }

    function init() {
      video = $("#hero");
      stage = $("#stage");
      ring = $("#ring");
      poster = $("#poster");

      bands = $$(".band").map(function (el) {
        return {
          el: el,
          a: parseFloat(el.dataset.a),
          b: parseFloat(el.dataset.b),
          opacity: -1,
          k: -1
        };
      });

      if (video) {
        video.addEventListener("seeked", function () {
          seekBusy = false;
          if (pendingSeek !== null) {
            var t = pendingSeek;
            pendingSeek = null;
            requestSeek(t);
          }
        });
        // sem isso um seek com erro trancaria o portao para sempre
        video.addEventListener("error", function () {
          seekBusy = false;
          pendingSeek = null;
        });
      }

      previewOverride = new URLSearchParams(location.search).get("video") === "1";
      mqls = GATES.map(function (q) { return window.matchMedia(q); });
      mqls.forEach(function (mq) { mq.addEventListener("change", apply); });

      var hero = $(".hero");
      if (hero && VIDEO.ready && "IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            heroVisible = e.isIntersecting;
            wake();
          });
        }, { threshold: 0 }).observe(hero);
      }

      apply();
    }

    return {
      init: init,
      apply: apply,
      onResize: function () { if (active) follow(); },
      pin: function () {
        bands.forEach(function (b) {
          b.el.style.opacity = 1;
          b.el.style.setProperty("--k", 1);
          b.opacity = -1;
          b.k = -1;
        });
      },
      unpin: function () {
        // limpa o que o pin escreveu, para o scroll voltar a mandar
        bands.forEach(function (b) {
          b.el.style.opacity = "";
          b.el.style.removeProperty("--k");
          b.opacity = -1;
          b.k = -1;
        });
      }
    };
  })();

  /* =======================================================
     15. MOVIMENTO REDUZIDO, AO VIVO E NOS DOIS SENTIDOS
     ======================================================= */

  var motion = (function () {
    var modules = [trail, pathHold, reveals, heroScrub];

    function pin() {
      modules.forEach(function (m) { if (m.pin) m.pin(); });
    }
    function unpin() {
      modules.forEach(function (m) { if (m.unpin) m.unpin(); });
      heroScrub.apply();
    }

    function init() {
      reducedMQ.addEventListener("change", function (e) {
        if (e.matches) pin();
        else unpin();
      });
      if (reducedMQ.matches) pin();
    }

    return { init: init };
  })();

  /* =======================================================
     16. ABERTURA NO TOPO

     O navegador guarda onde a pessoa parou e devolve ela no mesmo
     ponto na visita seguinte, o que fazia a pagina abrir no meio.
     Aqui o controle passa a ser nosso: com ancora na URL o salto
     continua acontecendo, sem ancora a pagina comeca do inicio.
     ======================================================= */

  var abertura = (function () {
    var mexeu = false;

    function marcarQueMexeu() {
      mexeu = true;
    }

    function aoTopo() {
      if (location.hash || mexeu) return;
      // "instant" evita que o scroll-behavior:smooth do CSS anime a subida
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }

    function init() {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";

      // se a pessoa ja comecou a rolar durante o carregamento, nao atrapalhamos
      var opcoes = { passive: true, once: true };
      window.addEventListener("wheel", marcarQueMexeu, opcoes);
      window.addEventListener("touchstart", marcarQueMexeu, opcoes);
      window.addEventListener("keydown", marcarQueMexeu, { once: true });

      aoTopo();
      window.addEventListener("load", aoTopo);
    }

    return { init: init };
  })();

  /* =======================================================
     17. ARRANQUE
     ======================================================= */

  function onResize() {
    measureLayout();
    header.onResize();
    faq.onResize();
    trail.onResize();
    heroScrub.onResize();
  }

  function start() {
    abertura.init();
    prepareBandText();
    whatsapp.init();
    header.init();
    menu.init();
    measureLayout();
    trail.init();
    catalog.init();
    faq.init();
    pathHold.init();
    reveals.init();
    floatingButton.init();
    heroScrub.init();
    motion.init();

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("load", onResize);
    document.addEventListener("visibilitychange", function () {
      document.body.classList.toggle("paused", document.hidden);
    });
  }

  /* =======================================================
     18. TEXTO DAS FAIXAS
     Divide o titulo em palavras ou letras para as entradas.
     O aleatorio e semeado, entao o resultado e igual em toda
     carga. Uma copia invisivel guarda a frase inteira para
     leitores de tela.
     ======================================================= */

  function seededRandom(seed) {
    var s = seed >>> 0;
    return function () { return (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  }

  function buildBlurLayers(el, text) {
    el.innerHTML = "";
    ["sr", "soft", "sharp"].forEach(function (cls) {
      var span = document.createElement("span");
      span.className = cls;
      span.textContent = text;
      if (cls !== "sr") span.setAttribute("aria-hidden", "true");
      el.appendChild(span);
    });
  }

  function buildSplitLayers(el, text, mode, seed) {
    var random = seededRandom(seed);
    el.textContent = "";

    var reader = document.createElement("span");
    reader.className = "sr";
    reader.textContent = text;
    el.appendChild(reader);

    var visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");

    var words = text.split(" ");
    var totalChars = text.replace(/ /g, "").length;
    var charIndex = 0;

    words.forEach(function (word, wi) {
      var wordEl = document.createElement("span");
      wordEl.className = "w";
      wordEl.style.setProperty("--th", (wi / Math.max(1, words.length) * 0.42).toFixed(3));

      if (mode === "char") {
        word.split("").forEach(function (ch) {
          var charEl = document.createElement("span");
          charEl.className = "c";
          charEl.textContent = ch;
          charEl.style.setProperty("--th",
            (charIndex / Math.max(1, totalChars) * 0.4 + random() * 0.06).toFixed(3));
          charEl.style.setProperty("--jx", Math.round((random() * 2 - 1) * 26) + "px");
          wordEl.appendChild(charEl);
          charIndex++;
        });
      } else {
        wordEl.textContent = word;
      }

      visual.appendChild(wordEl);
      if (wi < words.length - 1) visual.appendChild(document.createTextNode(" "));
    });

    el.appendChild(visual);
  }

  function prepareBandText() {
    $$(".band .split").forEach(function (el, i) {
      var text = el.textContent.trim();
      if (el.classList.contains("e-blur")) {
        buildBlurLayers(el, text);
      } else {
        buildSplitLayers(el, text, el.getAttribute("data-split") || "word", 1337 + i * 977);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
