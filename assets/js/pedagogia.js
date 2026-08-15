(function () {
  "use strict";

  var form = document.getElementById("pedagogiaForm");
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll(".ped-step"));
  var current = 0;
  var next = document.getElementById("nextStep");
  var prev = document.getElementById("prevStep");
  var submit = document.getElementById("submitForm");
  var label = document.getElementById("stepLabel");
  var bar = document.getElementById("progressBar");
  var error = document.getElementById("formError");
  var success = document.getElementById("formSuccess");

  function selected(name) {
    return form.querySelectorAll('[name="' + name + '"]:checked').length > 0;
  }

  function validateStep() {
    var step = current + 1;
    var valid = true;
    if (step === 1) valid = selected("interesse");
    if (step === 2) valid = selected("ensinoMedio");
    if (step === 3) valid = selected("objetivo");
    if (step === 4) valid = selected("perfil");
    if (step === 5) valid = form.elements.cidade.value.trim() && selected("presencial");
    if (step === 6) valid = selected("inicio");
    if (step === 7) valid = form.elements.nome.value.trim() && form.elements.whatsapp.value.trim();
    error.textContent = valid ? "" : "Escolha ou preencha a resposta antes de continuar.";
    return valid;
  }

  function render() {
    steps.forEach(function (step, index) { step.classList.toggle("is-active", index === current); });
    label.textContent = "Etapa " + (current + 1) + " de " + steps.length;
    bar.style.width = (((current + 1) / steps.length) * 100) + "%";
    prev.hidden = current === 0;
    next.hidden = current === steps.length - 1;
    submit.hidden = current !== steps.length - 1;
    error.textContent = "";
  }

  function values(name) {
    return Array.prototype.slice.call(form.querySelectorAll('[name="' + name + '"]:checked')).map(function (input) { return input.value; }).join(", ");
  }

  function buildMessage() {
    return [
      "Olá! Preenchi a orientação de Pedagogia na página da equipe Tania Vital.",
      "",
      "Nome: " + form.elements.nome.value.trim(),
      "WhatsApp: " + form.elements.whatsapp.value.trim(),
      "Cidade/UF: " + form.elements.cidade.value.trim(),
      "Interesse: " + values("interesse"),
      "Ensino Médio: " + values("ensinoMedio"),
      "Objetivo: " + values("objetivo"),
      "Perfil: " + values("perfil"),
      "Disponibilidade presencial eventual: " + values("presencial"),
      "Previsão de início: " + values("inicio")
    ].join("\n");
  }

  next.addEventListener("click", function () {
    if (!validateStep()) return;
    current += 1;
    render();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  prev.addEventListener("click", function () {
    current -= 1;
    render();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateStep()) return;
    var message = buildMessage();
    document.getElementById("successWhatsapp").href = "https://wa.me/5567999021267?text=" + encodeURIComponent(message);
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  render();
})();
