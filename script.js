// Banco de palavras organizado por dificuldade
const dicionarioPalavras = {
  facil: [
    "rato",
    "gato",
    "cão",
    "ator",
    "rota",
    "tora",
    "sol",
    "lua",
    "rio",
    "mar",
    "paz",
    "luz",
    "rosa",
    "mesa",
    "copo",
    "bola",
    "casa",
    "rua",
    "vida",
    "davi",
    "som",
    "ar",
  ],
  medio: [
    "livro",
    "porta",
    "cinto",
    "faca",
    "vela",
    "neve",
    "vento",
    "areia",
    "andar",
    "correr",
    "pular",
    "verde",
    "roxo",
    "preto",
    "branco",
    "tempo",
    "carro",
    "cidade",
    "tigre",
    "cobra",
    "sapo",
  ],
  dificil: [
    "correr",
    "pular",
    "andar",
    "amarelo",
    "cinza",
    "floresta",
    "montanha",
    "planeta",
    "estrela",
    "galáxia",
    "neblina",
    "chuva",
    "relâmpago",
    "correrias",
    "amizade",
    "esperança",
    "liberdade",
    "sabedoria",
  ],
};

let letrasDisponiveis = [];
let pontuacao = 0;
let palavrasFormadas = [];
let tempoRestante = 0;
let temporizador;

function gerarLetras(dificuldade) {
  const palavras = dicionarioPalavras[dificuldade];
  const palavra = palavras[Math.floor(Math.random() * palavras.length)];
  const letrasUnicas = [...new Set(palavra.split(""))];
  letrasUnicas.sort(() => Math.random() - 0.5);

  let limite = 6; // padrão
  if (dificuldade === "medio") limite = 7;
  if (dificuldade === "dificil") limite = letrasUnicas.length; // usa todas as letras únicas

  return letrasUnicas.slice(0, limite);
}

function iniciarJogo() {
  const dificuldade = document.getElementById("dificuldade").value;
  if (dificuldade === "facil") tempoRestante = 60;
  else if (dificuldade === "medio") tempoRestante = 45;
  else tempoRestante = 30;

  letrasDisponiveis = gerarLetras(dificuldade);
  pontuacao = 0;
  palavrasFormadas = [];

  document.getElementById("jogo").style.display = "block";
  document.getElementById("tempo").textContent = tempoRestante;
  document.getElementById("letras").textContent = letrasDisponiveis
    .join(" ")
    .toUpperCase();
  document.getElementById("pontuacao").textContent = pontuacao;
  document.getElementById("palavrasCorretas").textContent = "";

  // 🔑 Esconde o resultado final ao iniciar o jogo
  document.getElementById("resultadoFinal").style.display = "none";

  clearInterval(temporizador);
  temporizador = setInterval(() => {
    tempoRestante--;
    document.getElementById("tempo").textContent = tempoRestante;
    if (tempoRestante <= 0) {
      clearInterval(temporizador);
      mostrarPalavrasPossiveis(dificuldade);
    }
  }, 1000);
}

function palavraValida(palavra) {
  let letrasTemp = [...letrasDisponiveis];
  for (let c of palavra) {
    if (!letrasTemp.includes(c)) return false;
    letrasTemp.splice(letrasTemp.indexOf(c), 1);
  }
  return true;
}

function mostrarMensagem(texto, tipo) {
  const msg = document.getElementById("mensagem");
  msg.textContent = texto;
  msg.className = "mensagem " + tipo;
  msg.style.display = "block";

  // Esconde automaticamente após alguns segundos
  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
}

function verificarPalavra() {
  const dificuldade = document.getElementById("dificuldade").value;
  const palavra = document.getElementById("entradaPalavra").value.toLowerCase();
  if (
    dicionarioPalavras[dificuldade].includes(palavra) &&
    palavraValida(palavra)
  ) {
    if (!palavrasFormadas.includes(palavra)) {
      palavrasFormadas.push(palavra);
      pontuacao += 10;
      document.getElementById("pontuacao").textContent = pontuacao;
      document.getElementById("palavrasCorretas").textContent =
        palavrasFormadas.join(", ");
      mostrarMensagem("✅ Correto! +10 pontos", "sucesso");
      let possiveis = dicionarioPalavras[dificuldade].filter((p) =>
        palavraValida(p)
      );
      possiveis = possiveis.filter((p) => !palavrasFormadas.includes(p));

      // Se não sobrar nenhuma, gera novas letras automaticamente
      if (possiveis.length === 0 && tempoRestante > 0) {
        letrasDisponiveis = gerarLetras(dificuldade);
        document.getElementById("letras").textContent = letrasDisponiveis
          .join(" ")
          .toUpperCase();
        mostrarMensagem(
          "✨ Todas as palavras possíveis foram encontradas! Novas letras geradas!",
          "aviso"
        );
      }
    } else {
      mostrarMensagem("⚠️ Você já usou essa palavra!", "aviso");
    }
  } else {
    mostrarMensagem("❌ Palavra inválida ou não pode ser formada.", "erro");
  }
  document.getElementById("entradaPalavra").value = "";
}

function mostrarPalavrasPossiveis(dificuldade) {
  // Lista todas as palavras possíveis com as letras sorteadas
  let possiveis = dicionarioPalavras[dificuldade].filter((p) =>
    palavraValida(p)
  );

  // Remove as palavras que já foram acertadas
  possiveis = possiveis.filter((p) => !palavrasFormadas.includes(p));

  const resultadoDiv = document.getElementById("resultadoFinal");
  resultadoDiv.style.display = "block";

  if (possiveis.length === 0) {
    resultadoDiv.innerHTML =
      "⏰ Tempo esgotado!<br>" +
      "Você fez <strong>" +
      pontuacao +
      "</strong> pontos.<br>" +
      "🎉 Você acertou todas as palavras possíveis!";
  } else {
    resultadoDiv.innerHTML =
      "⏰ Tempo esgotado!<br>" +
      "Você fez <strong>" +
      pontuacao +
      "</strong> pontos.<br>" +
      "Palavras possíveis restantes: <br>" +
      "<span style='color:#2980b9'>" +
      possiveis.join(", ") +
      "</span>";
  }
}
