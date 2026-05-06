document.addEventListener("DOMContentLoaded", function () {
  const container4 = document.querySelector(".container--4");

  // Configuração dos dados de cada barra (Elementos, Alturas Máximas e Valores Máximos)
  const barras = [
    {
      retangulo: document.querySelector(".retangulo1"),
      txtValor: document.querySelector(".j .valord"),
      alturaMax: 250,
      valorMax: 6300,
      id: 0,
      currentHeight: 0,
      currentPrice: 0,
      animFrame: null,
    },
    {
      retangulo: document.querySelector(".retangulo2"),
      txtValor: document.querySelector(".p .valord"),
      alturaMax: 350,
      valorMax: 7271,
      id: 1,
      currentHeight: 0,
      currentPrice: 0,
      animFrame: null,
    },
    {
      retangulo: document.querySelector(".retangulo3"),
      txtValor: document.querySelector(".s .valord"),
      alturaMax: 450,
      valorMax: 10561,
      id: 2,
      currentHeight: 0,
      currentPrice: 0,
      animFrame: null,
    },
  ];

  let timeoutsAba = [];

  function limparTimeouts() {
    timeoutsAba.forEach((t) => clearTimeout(t));
    timeoutsAba = [];
  }

  // Função única que anima tanto a ALTURA quanto o PREÇO juntos
  function executarAnimacao(barra, objetivo) {
    // Se já tiver uma animação rodando nesta barra, cancela ela
    if (barra.animFrame) cancelAnimationFrame(barra.animFrame);

    const alturaInicial = barra.currentHeight;
    const precoInicial = barra.currentPrice;

    const alturaAlvo = objetivo === "subir" ? barra.alturaMax : 0;
    const precoAlvo = objetivo === "subir" ? barra.valorMax : 0;

    const duracao = objetivo === "subir" ? 1500 : 800; // velocidade de subida e descida
    let tempoInicio = null;

    function passo(tempoAtual) {
      if (!tempoInicio) tempoInicio = tempoAtual;
      const progresso = Math.min((tempoAtual - tempoInicio) / duracao, 1);

      // Efeito de desaceleração (Ease-out)
      const progressoSuave = 1 - Math.pow(1 - progresso, 3);

      // Calcula os valores atuais baseados no progresso
      barra.currentHeight =
        alturaInicial + (alturaAlvo - alturaInicial) * progressoSuave;
      barra.currentPrice =
        precoInicial + (precoAlvo - precoInicial) * progressoSuave;

      // Aplica no HTML/CSS
      barra.retangulo.style.height = barra.currentHeight + "px";
      barra.txtValor.textContent =
        "R$ " + Math.floor(barra.currentPrice).toLocaleString("pt-BR");

      if (progresso < 1) {
        barra.animFrame = requestAnimationFrame(passo);
      }
    }

    barra.animFrame = requestAnimationFrame(passo);
  }

  // Monitor do usuário rolando a tela
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        limparTimeouts();

        if (entry.isIntersecting) {
          // --- USUÁRIO CHEGOU: Subir tudo em cascata (Junior -> Pleno -> Senior) ---
          barras.forEach(function (barra, index) {
            const t = setTimeout(function () {
              executarAnimacao(barra, "subir");
            }, index * 250); // 250ms de atraso entre cada barra
            timeoutsAba.push(t);
          });
        } else {
          // --- USUÁRIO SAIU: Abaixar tudo em cascata inversa (Senior -> Pleno -> Junior) ---
          barras.forEach(function (barra, index) {
            const t = setTimeout(
              function () {
                executarAnimacao(barra, "abaixar");
              },
              (2 - index) * 150,
            ); // Sênior desce primeiro
            timeoutsAba.push(t);
          });
        }
      });
    },
    {
      threshold: 0.15, // Dispara quando 15% do bloco aparece/some na tela
    },
  );

  // Inicializa as barras zeradas
  barras.forEach((b) => {
    b.retangulo.style.height = "0px";
    b.txtValor.textContent = "R$ 0";
  });

  observer.observe(container4);
});

// FAQ Accordion
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const pergunta = item.querySelector(".faq-pergunta");

  pergunta.addEventListener("click", () => {
    const estaAtivo = item.classList.contains("ativo");

    // Opcional: Fecha outros FAQs abertos ao clicar em um novo
    faqItems.forEach((i) => i.classList.remove("ativo"));

    // Se o que clicamos não estava aberto, abre ele
    if (!estaAtivo) {
      item.classList.add("ativo");
    }
  });
});
