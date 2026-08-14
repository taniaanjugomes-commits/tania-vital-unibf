/* =========================================================
   Tania Vital, consultora educacional UniBF
   ========================================================= */
(function () {
  "use strict";

  var WA_NUMBER = "5567999021267";

  var VIDEO = {
    ready: true,
    src: "assets/hero-scrub.mp4",
    poster: "assets/img/hero-poster.jpg",
    bytes: 6622482
  };

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); };
  var smoothstep = function (p, e0, e1) {
    var t = clamp((p - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  var reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------
     WhatsApp: uma mensagem por contexto, marcada pela origem
     --------------------------------------------------------- */
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

  function waHref(action) {
    var msg = "Olá Tania! " + originPhrase() + " " + action + ".";
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
  }

  function wireWhatsApp(root) {
    $$("[data-wa]", root).forEach(function (el) {
      el.href = waHref(el.getAttribute("data-wa"));
      el.target = "_blank";
      el.rel = "noopener";
    });
  }

  /* ---------------------------------------------------------
     Divisao de texto em palavras e letras, com aleatorio semeado
     --------------------------------------------------------- */
  function rng(seed) {
    var s = seed >>> 0;
    return function () { return (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  }

  function splitText(el, mode, seed) {
    var text = el.textContent.trim();
    var rand = rng(seed);
    el.textContent = "";

    var sr = document.createElement("span");
    sr.className = "sr";
    sr.textContent = text;
    el.appendChild(sr);

    var vis = document.createElement("span");
    vis.setAttribute("aria-hidden", "true");

    var words = text.split(" ");
    var charIndex = 0;
    var totalChars = text.replace(/ /g, "").length;

    words.forEach(function (word, wi) {
      var w = document.createElement("span");
      w.className = "w";
      w.style.setProperty("--th", (wi / Math.max(1, words.length) * 0.42).toFixed(3));

      if (mode === "char") {
        word.split("").forEach(function (ch) {
          var c = document.createElement("span");
          c.className = "c";
          c.textContent = ch;
          c.style.setProperty("--th", (charIndex / Math.max(1, totalChars) * 0.4 + rand() * 0.06).toFixed(3));
          c.style.setProperty("--jx", (Math.round((rand() * 2 - 1) * 26)) + "px");
          w.appendChild(c);
          charIndex++;
        });
      } else {
        w.textContent = word;
      }
      vis.appendChild(w);
      if (wi < words.length - 1) vis.appendChild(document.createTextNode(" "));
    });

    el.appendChild(vis);
    return vis;
  }

  function prepareBands() {
    $$(".band .split").forEach(function (el, i) {
      if (el.classList.contains("e-blur")) {
        var text = el.textContent.trim();
        el.innerHTML = "";
        var sr = document.createElement("span");
        sr.className = "sr"; sr.textContent = text; el.appendChild(sr);
        var soft = document.createElement("span");
        soft.className = "soft"; soft.setAttribute("aria-hidden", "true"); soft.textContent = text;
        var sharp = document.createElement("span");
        sharp.className = "sharp"; sharp.setAttribute("aria-hidden", "true"); sharp.textContent = text;
        el.appendChild(soft); el.appendChild(sharp);
      } else {
        splitText(el, el.getAttribute("data-split") || "word", 1337 + i * 977);
      }
    });
  }

  /* =========================================================
     DOCUMENTO PRONTO
     ========================================================= */
  document.addEventListener("DOMContentLoaded", function () {

    prepareBands();
    wireWhatsApp(document);

    /* ---------------- menu do celular ---------------- */
    var burger = $(".burger"), mnav = $(".mnav");
    if (burger && mnav) {
      burger.addEventListener("click", function () {
        var open = mnav.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      $$("a", mnav).forEach(function (a) {
        a.addEventListener("click", function () {
          mnav.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }

    /* ---------------- altura real do cabecalho ----------------
       O heroi do celular dimensiona por ela, para o botao do WhatsApp
       nunca cair abaixo da dobra em aparelho nenhum. */
    var hdrEl = $(".hdr"), lastHdrH = -1;
    function measureHeader() {
      if (!hdrEl) return;
      var h = Math.round(hdrEl.getBoundingClientRect().height);
      if (h !== lastHdrH) {
        lastHdrH = h;
        document.documentElement.style.setProperty("--hdr", h + "px");
      }
    }
    measureHeader();
    addEventListener("resize", measureHeader);
    addEventListener("orientationchange", measureHeader);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureHeader);

    /* ---------------- sombra do cabecalho ---------------- */
    var hdr = hdrEl, hdrShadow = false;
    function onHdrScroll() {
      var want = window.scrollY > 8;
      if (want !== hdrShadow) {
        hdrShadow = want;
        hdr.style.boxShadow = want ? "0 6px 22px rgba(46,27,13,.08)" : "none";
      }
    }
    addEventListener("scroll", onHdrScroll, { passive: true });
    onHdrScroll();

    /* ---------------- o caminho dourado que se desenha ---------------- */
    var trail = $(".trail"), main = $("#main"), lastDraw = -1;
    function drawTrail() {
      if (!trail || !main) return;
      var r = main.getBoundingClientRect();
      var span = r.height - innerHeight;
      var p = span > 0 ? clamp((-r.top) / span, 0, 1) : 1;
      var v = Math.round(p * 200) / 200;
      if (v !== lastDraw) { lastDraw = v; trail.style.setProperty("--draw", v); }
    }
    addEventListener("scroll", drawTrail, { passive: true });
    addEventListener("resize", drawTrail);
    drawTrail();

    /* ---------------- catalogo: abas e busca global ---------------- */
    var tabsWrap = $("#catTabs"), ticket = $("#ticket"), search = $("#catSearch");

    if (tabsWrap && ticket && typeof COURSE_CATEGORIES !== "undefined") {
      var activeId = COURSE_CATEGORIES[0].id;

      COURSE_CATEGORIES.forEach(function (cat) {
        var b = document.createElement("button");
        b.className = "tab" + (cat.id === activeId ? " on" : "");
        b.type = "button";
        b.dataset.id = cat.id;
        b.innerHTML = cat.label + ' <span class="n">' + cat.duration + "</span>";
        b.addEventListener("click", function () {
          activeId = cat.id;
          if (search) search.value = "";
          paintTabs();
          paintCategory(cat);
        });
        tabsWrap.appendChild(b);
      });

      $$("[data-tab]").forEach(function (link) {
        link.addEventListener("click", function () {
          var t = tabsWrap.querySelector('.tab[data-id="' + link.getAttribute("data-tab") + '"]');
          if (t) t.click();
        });
      });

      function paintTabs() {
        $$(".tab", tabsWrap).forEach(function (b) { b.classList.toggle("on", b.dataset.id === activeId); });
      }

      function rowFor(course, cat, withMeta) {
        var action = "quero saber mais sobre o curso de " + course + " (" + cat.label + ", " + cat.duration + ")";
        return '<li class="crow"><span class="crow__n">' + course +
          (withMeta ? '<span class="crow__meta">' + cat.label + " · " + cat.duration + "</span>" : "") +
          '</span><a class="crow__go" href="' + waHref(action) + '" target="_blank" rel="noopener">Fale comigo' +
          '<svg aria-hidden="true"><use href="#i-go"/></svg></a></li>';
      }

      function emptyRow() {
        return '<li class="cempty">Nenhum curso encontrado com esse termo. Tente outra palavra ou <a href="' +
          waHref("não encontrei o curso que procuro na sua página, pode me ajudar") +
          '" target="_blank" rel="noopener">fale comigo direto</a>.</li>';
      }

      function paintCategory(cat) {
        ticket.innerHTML =
          '<div class="ticket__head"><div><h3>' + cat.label + "</h3>" +
          '<div class="dur">Duração ' + cat.duration + " · " + cat.courses.length + " cursos</div></div>" +
          '<div class="ticket__stamp">' + cat.tag + "</div></div>" +
          (cat.note ? '<p class="ticket__note">' + cat.note + "</p>" : "") +
          '<ul class="clist">' + cat.courses.map(function (c) { return rowFor(c, cat, false); }).join("") + "</ul>";
      }

      function paintSearch(q) {
        var needle = q.trim().toLowerCase(), hits = [];
        COURSE_CATEGORIES.forEach(function (cat) {
          if (cat.id === "segunda-graduacao") return;
          cat.courses.forEach(function (course) {
            if (course.toLowerCase().indexOf(needle) !== -1) hits.push({ c: course, cat: cat });
          });
        });
        ticket.innerHTML =
          '<div class="ticket__head"><div><h3>Resultados para "' + q + '"</h3>' +
          '<div class="dur">' + hits.length + " curso(s) encontrado(s)</div></div>" +
          '<div class="ticket__stamp">BUSCA</div></div>' +
          (hits.length ? '<p class="ticket__note">Esses cursos também estão disponíveis pela Segunda Graduação, para quem já tem diploma.</p>' : "") +
          '<ul class="clist">' + (hits.length ? hits.map(function (h) { return rowFor(h.c, h.cat, true); }).join("") : emptyRow()) + "</ul>";
      }

      paintCategory(COURSE_CATEGORIES[0]);

      if (search) {
        search.addEventListener("input", function () {
          var q = search.value;
          if (q.trim() === "") {
            paintTabs();
            paintCategory(COURSE_CATEGORIES.find(function (c) { return c.id === activeId; }));
          } else {
            paintSearch(q);
          }
        });
      }
    }

    /* ---------------- perguntas frequentes ---------------- */
    $$(".fitem").forEach(function (item) {
      var q = $(".fitem__q", item), a = $(".fitem__a", item);
      q.addEventListener("click", function () {
        var open = item.classList.contains("open");
        $$(".fitem.open").forEach(function (other) {
          if (other !== item) {
            other.classList.remove("open");
            $(".fitem__a", other).style.maxHeight = null;
            $(".fitem__q", other).setAttribute("aria-expanded", "false");
          }
        });
        item.classList.toggle("open", !open);
        q.setAttribute("aria-expanded", String(!open));
        a.style.maxHeight = !open ? a.scrollHeight + "px" : null;
      });
    });

    /* ---------------- o momento interativo: segurar o caminho ---------------- */
    var holdBtn = $("#holdBtn"), holdBox = $("#hold"), steps = $$(".pstep");
    if (holdBtn && holdBox) {
      var hp = 0, holding = false, hraf = null, hlast = 0, lastLit = -1, holdDone = false;
      var LIT = [0.16, 0.40, 0.64, 0.90];

      function markDone() {
        holdDone = true;
        holdBox.classList.add("done");
        $("i", holdBtn).textContent = "Feito";
      }

      function paintHold() {
        holdBtn.style.setProperty("--hp", hp.toFixed(3));
        var lit = 0;
        for (var i = 0; i < LIT.length; i++) if (hp >= LIT[i]) lit = i + 1;
        if (lit !== lastLit) {
          lastLit = lit;
          steps.forEach(function (s, i) { s.classList.toggle("lit", i < lit); });
        }
        if (hp >= 0.999 && !holdDone) markDone();
      }

      function htick(now) {
        var dt = Math.min(100, now - (hlast || now));
        hlast = now;
        var dir = holding ? 1 : -1;
        var speed = holding ? 1 / 2200 : 1 / 900;
        hp = clamp(hp + dir * dt * speed, 0, 1);
        paintHold();
        if ((holding && hp < 1) || (!holding && hp > 0)) {
          hraf = requestAnimationFrame(htick);
        } else { hraf = null; hlast = 0; }
      }
      function startHold(e) {
        if (e && e.cancelable) e.preventDefault();
        if (holdDone) return;
        holding = true;
        if (hraf === null) hraf = requestAnimationFrame(htick);
      }
      function stopHold() {
        if (holdDone) return;          // concluido nao volta atras
        holding = false;
        if (hraf === null && hp > 0) hraf = requestAnimationFrame(htick);
      }
      holdBtn.addEventListener("pointerdown", startHold);
      addEventListener("pointerup", stopHold);
      addEventListener("pointercancel", stopHold);
      holdBtn.addEventListener("pointerleave", stopHold);
      holdBtn.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); startHold(); }
      });
      holdBtn.addEventListener("keyup", stopHold);

      var holdFinal = function () {
        holding = false;
        if (hraf !== null) { cancelAnimationFrame(hraf); hraf = null; }
        hp = 1; lastLit = -1;
        paintHold();   // acende as quatro etapas
        markDone();    // e so entao tranca, para o rotulo e a classe entrarem
      };
      var holdReset = function () {
        if (reduceMQ.matches) return;
        holdDone = false; hp = 0; lastLit = -1;
        holdBox.classList.remove("done");
        $("i", holdBtn).textContent = "Segure";
        paintHold();
      };
      window.__holdFinal = holdFinal;
      window.__holdReset = holdReset;
      if (reduceMQ.matches) holdFinal();
    }

    /* ---------------- entradas de secao ---------------- */
    var revealables = $$(".rv, .stg");
    if ("IntersectionObserver" in window && revealables.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
          if (e.target.classList.contains("stg")) {
            setTimeout(function () { e.target.classList.add("done"); }, 1100);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add("in", "done"); });
    }

    /* ---------------- o botao flutuante recolhe perto de outro CTA ---------------- */
    var float = $(".wafloat");
    var anchors = $$(".hero-static__cta, .band--settle .btn, .final .btn");
    if (float && anchors.length && "IntersectionObserver" in window) {
      var seen = new WeakMap();
      var aio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { seen.set(e.target, e.isIntersecting); });
        var any = anchors.some(function (el) { return seen.get(el) === true; });
        float.classList.toggle("tucked", any);
      }, { threshold: 0.35 });
      anchors.forEach(function (el) { aio.observe(el); });
    }

    /* ---------------- pausar animacao com a aba escondida ---------------- */
    document.addEventListener("visibilitychange", function () {
      document.body.classList.toggle("paused", document.hidden);
    });

    /* =========================================================
       HEROI SCRUB
       Um unico dono da decisao: a classe html.scrub, escrita pelo JS
       a partir dos cinco portoes, vivos por listener. Sem JS, o
       padrao continua sendo o heroi estatico, que e completo.
       ========================================================= */
    var GATES = [
      "(max-width: 720px)",
      "(orientation: portrait) and (max-width: 1024px)",
      "(orientation: portrait) and (pointer: coarse)",
      "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
      "(prefers-reduced-motion: reduce)"
    ];
    var MQLS = GATES.map(function (q) { return matchMedia(q); });

    var video = $("#hero"), stage = $("#stage"), ring = $("#ring"),
        poster = $("#poster"), bandEls = $$(".band");

    var bands = bandEls.map(function (el) {
      return {
        el: el,
        a: parseFloat(el.dataset.a),
        b: parseFloat(el.dataset.b),
        op: -1,
        k: -1
      };
    });

    var target = 0, shown = 0, raf = null, lastTick = 0;
    var seekBusy = false, pendingTime = null;
    var heroOn = false, scrubOn = false, started = false, loadK = 0, loadT0 = 0;

    function heroProgress() {
      var hero = $(".hero");
      if (!hero) return 0;
      var r = hero.getBoundingClientRect();
      var span = r.height - innerHeight;
      return span > 0 ? clamp((-r.top) / span, 0, 1) : 0;
    }

    function requestSeek(t) {
      if (!video || !video.duration) return;
      if (seekBusy) { pendingTime = t; return; }
      seekBusy = true;
      video.currentTime = t;
    }
    if (video) {
      video.addEventListener("seeked", function () {
        seekBusy = false;
        if (pendingTime !== null) { var t = pendingTime; pendingTime = null; requestSeek(t); }
      });
      video.addEventListener("error", function () { seekBusy = false; pendingTime = null; });
    }

    function paintBands(p) {
      bands.forEach(function (b, i) {
        var f = Math.min(0.02, (b.b - b.a) / 3);
        var inRamp  = i === 0 ? 0 : f;
        var outRamp = i === bands.length - 1 ? 0 : f;
        var op = smoothstep(p, b.a, b.a + inRamp) * (1 - smoothstep(p, b.b - outRamp, b.b));
        if (i === 0 && p <= b.a) op = 1;
        var ramp = Math.min(0.025, (b.b - b.a) * 0.35);
        var k = clamp((p - b.a) / ramp, 0, 1);
        if (i === 0) k = Math.max(k, loadK);

        var opQ = Math.round(op * 100) / 100;
        var kQ  = Math.round(k * 125) / 125;
        if (opQ !== b.op) { b.op = opQ; b.el.style.opacity = opQ; }
        if (kQ !== b.k)   { b.k = kQ;  b.el.style.setProperty("--k", kQ); }
      });
    }

    function tick(now) {
      var dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      var k = 0.16;
      shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));

      if (loadK < 1 && loadT0) {
        loadK = clamp((now - loadT0) / 900, 0, 1);
      }

      var converged = Math.abs(target - shown) < 0.0005 && loadK >= 1;
      if (converged) { shown = target; }

      if (video && video.duration) requestSeek(shown * video.duration);
      paintBands(shown);

      if (converged) { raf = null; lastTick = 0; }
      else { raf = requestAnimationFrame(tick); }
    }

    function onScroll() {
      target = heroProgress();
      if (raf === null && heroOn && scrubOn) { lastTick = 0; raf = requestAnimationFrame(tick); }
    }

    function failVideo() {
      if (stage) stage.classList.add("video-failed");
    }

    function loadHeroBlob() {
      var ctrl = new AbortController();
      var watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
      return fetch(VIDEO.src, { priority: "low", signal: ctrl.signal }).then(function (res) {
        if (!res.ok) throw new Error("http " + res.status);
        var total = Number(res.headers.get("Content-Length")) || VIDEO.bytes || 1;
        var reader = res.body.getReader();
        var chunks = [], got = 0, lastRing = 0;
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) return;
            clearTimeout(watchdog);
            watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
            chunks.push(r.value);
            got += r.value.length;
            var frac = Math.min(1, got / total);
            var now = performance.now();
            if (now - lastRing > 100 || frac === 1) {
              lastRing = now;
              if (ring) ring.style.setProperty("--ld", Math.round(126 * (1 - frac)));
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
            requestSeek(heroProgress() * video.duration);
            stage.classList.add("video-ready");
          }, { once: true });
        });
      });
    }

    function initHeroOnce() {
      if (started) return;
      started = true;
      if (poster) poster.style.backgroundImage = "url('" + VIDEO.poster + "')";
      var go = false;
      function kick() { if (go) return; go = true; loadHeroBlob().catch(failVideo); }
      var im = new Image();
      im.onload = kick; im.onerror = kick; im.src = VIDEO.poster;
      setTimeout(kick, 4000);
    }

    function enableScrub() {
      if (scrubOn || !VIDEO.ready) return;
      scrubOn = true;
      document.documentElement.classList.add("scrub");
      initHeroOnce();
      loadT0 = performance.now(); loadK = 0;
      addEventListener("scroll", onScroll, { passive: true });
      bands.forEach(function (b) { b.op = -1; b.k = -1; });
      paintBands(heroProgress());
      onScroll();
    }

    function disableScrub() {
      if (!scrubOn) return;
      scrubOn = false;
      document.documentElement.classList.remove("scrub");
      removeEventListener("scroll", onScroll);
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    }

    /* ?video=1 e so para a Tania conferir o video no computador dela quando
       o Windows esta com animacoes desligadas. Ignora apenas o portao de
       movimento reduzido, nunca os de tamanho e de toque: forcar video em
       celular continua proibido. */
    var previewVideo = new URLSearchParams(location.search).get("video") === "1";

    function applyHeroMode() {
      var blocked = MQLS.some(function (m, i) {
        if (previewVideo && i === 4) return false;   // 4 = prefers-reduced-motion
        return m.matches;
      });
      if (blocked) disableScrub();
      else enableScrub();
    }
    MQLS.forEach(function (m) { m.addEventListener("change", applyHeroMode); });

    if (VIDEO.ready && "IntersectionObserver" in window) {
      var heroIO = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          heroOn = e.isIntersecting;
          if (heroOn && scrubOn && raf === null) { lastTick = 0; raf = requestAnimationFrame(tick); }
        });
      }, { threshold: 0 });
      var heroEl = $(".hero");
      if (heroEl) heroIO.observe(heroEl);
    }

    applyHeroMode();

    /* ---------------- movimento reduzido, ao vivo, nos dois sentidos ---------------- */
    function pinToFinalStates() {
      if (trail) trail.style.setProperty("--draw", 1);
      $$(".rv, .stg").forEach(function (el) { el.classList.add("in", "done"); });
      if (window.__holdFinal) window.__holdFinal();
      bands.forEach(function (b) { b.el.style.opacity = 1; b.el.style.setProperty("--k", 1); b.op = -1; b.k = -1; });
    }
    function unpinFinalStates() {
      lastDraw = -1; drawTrail();
      if (window.__holdReset) window.__holdReset();
    }
    reduceMQ.addEventListener("change", function (e) {
      if (e.matches) { pinToFinalStates(); }
      else { unpinFinalStates(); applyHeroMode(); }
    });
    if (reduceMQ.matches) pinToFinalStates();
  });

})();
