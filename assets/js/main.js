(function () {
  "use strict";

  var WA_NUMBER = "5567999021267";

  function waLink(message) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  }
  window.waLink = waLink;

  document.addEventListener("DOMContentLoaded", function () {
    /* ---------- Mobile nav ---------- */
    var burger = document.querySelector(".site-header__burger");
    var mobileNav = document.querySelector(".mobile-nav");
    if (burger && mobileNav) {
      burger.addEventListener("click", function () {
        var open = mobileNav.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      mobileNav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { mobileNav.classList.remove("is-open"); });
      });
    }

    /* ---------- Populate plain WhatsApp CTAs ---------- */
    document.querySelectorAll("[data-wa-msg]").forEach(function (el) {
      el.href = waLink(el.getAttribute("data-wa-msg"));
      el.target = "_blank";
      el.rel = "noopener";
    });

    /* ---------- Catálogo: tabs + busca + lista ---------- */
    var tabsWrap = document.getElementById("catalogoTabs");
    var panel = document.getElementById("ticketPanel");
    var searchInput = document.getElementById("catalogoSearch");

    if (tabsWrap && panel && typeof COURSE_CATEGORIES !== "undefined") {
      var activeId = COURSE_CATEGORIES[0].id;

      COURSE_CATEGORIES.forEach(function (cat) {
        var btn = document.createElement("button");
        btn.className = "catalogo__tab" + (cat.id === activeId ? " is-active" : "");
        btn.type = "button";
        btn.dataset.id = cat.id;
        btn.innerHTML = cat.label + " <span class=\"n\">" + cat.duration + "</span>";
        btn.addEventListener("click", function () {
          activeId = cat.id;
          searchInput.value = "";
          renderTabs();
          renderPanel(cat, "");
        });
        tabsWrap.appendChild(btn);
      });

      function renderTabs() {
        tabsWrap.querySelectorAll(".catalogo__tab").forEach(function (b) {
          b.classList.toggle("is-active", b.dataset.id === activeId);
        });
      }

      function courseMsg(course, cat) {
        return "Olá Tânia! Quero saber mais sobre o curso de " + course + " (" + cat.label + " — " + cat.duration + ").";
      }

      function renderPanel(cat, query) {
        var q = (query || "").trim().toLowerCase();
        var list = cat.courses.filter(function (c) { return c.toLowerCase().indexOf(q) !== -1; });

        var rowsHtml = list.length
          ? list.map(function (course) {
              return (
                '<li class="course-row">' +
                  '<span class="course-row__name">' + course + "</span>" +
                  '<a class="course-row__link" href="' + waLink(courseMsg(course, cat)) + '" target="_blank" rel="noopener">' +
                    "Fale comigo" +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg>' +
                  "</a>" +
                "</li>"
              );
            }).join("")
          : '<li class="course-list__empty">Nenhum curso encontrado com esse termo. Tente outra palavra ou <a href="' + waLink("Olá Tânia! Não encontrei o curso que procuro no site, pode me ajudar?") + '" target="_blank" rel="noopener" style="color:var(--navy);font-weight:700;text-decoration:underline;">fale comigo direto</a>.</li>';

        panel.innerHTML =
          '<div class="ticket-panel__head">' +
            "<div>" +
              "<h3>" + cat.label + "</h3>" +
              '<div class="dur">Duração ' + cat.duration + " · " + cat.courses.length + " cursos</div>" +
            "</div>" +
            '<div class="ticket-panel__stamp">' + cat.tag + "</div>" +
          "</div>" +
          (cat.note ? '<div class="ticket-panel__note">' + cat.note + "</div>" : "") +
          '<ul class="course-list">' + rowsHtml + "</ul>";
      }

      renderPanel(COURSE_CATEGORIES[0], "");

      if (searchInput) {
        searchInput.addEventListener("input", function () {
          var cat = COURSE_CATEGORIES.find(function (c) { return c.id === activeId; });
          renderPanel(cat, searchInput.value);
        });
      }
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector(".faq-item__q");
      var a = item.querySelector(".faq-item__a");
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        document.querySelectorAll(".faq-item.is-open").forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove("is-open");
            openItem.querySelector(".faq-item__a").style.maxHeight = null;
            openItem.querySelector(".faq-item__q").setAttribute("aria-expanded", "false");
          }
        });
        item.classList.toggle("is-open", !isOpen);
        q.setAttribute("aria-expanded", (!isOpen).toString());
        a.style.maxHeight = !isOpen ? a.scrollHeight + "px" : null;
      });
    });

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }

    /* ---------- Header shadow on scroll ---------- */
    var header = document.querySelector(".site-header");
    if (header) {
      window.addEventListener("scroll", function () {
        header.style.boxShadow = window.scrollY > 8 ? "0 6px 20px rgba(10,30,50,0.06)" : "none";
      });
    }
  });
})();
