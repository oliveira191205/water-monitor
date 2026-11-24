
const API_URL =
  "https://hctuxkfpmvyasmewelsv.supabase.co/functions/v1/monitoramento-reservatorio";

const INTERVALO_ATUALIZACAO = 5000;
const TEMPO_DADOS_DESATUALIZADOS = 60000;

let grafico = null;
let ultimaLeitura = null;

const elementos = {
  indicador: document.getElementById("indicador-conexao"),
  statusConexao: document.getElementById("status-conexao"),
  painelAlerta: document.getElementById("painel-alerta"),
  iconeAlerta: document.getElementById("icone-alerta"),
  tituloAlerta: document.getElementById("titulo-alerta"),
  mensagemAlerta: document.getElementById("mensagem-alerta"),
  nivel: document.getElementById("nivel-atual"),
  barra: document.getElementById("barra-nivel"),
  distancia: document.getElementById("distancia-atual"),
  data: document.getElementById("ultima-data"),
  hora: document.getElementById("ultima-hora"),
  historico: document.getElementById("corpo-historico"),
  total: document.getElementById("total-registros"),
  botao: document.getElementById("botao-atualizar")
};

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarHora(data) {
  return new Date(data).toLocaleTimeString("pt-BR");
}

function atualizarConexao(status, mensagem) {
  elementos.statusConexao.textContent = mensagem;
  elementos.indicador.className = "ponto " + status;
}

function atualizarAlerta(leitura) {
  const nivel = Number(leitura.level_percent);
  const emAlerta = leitura.alerta === true || nivel < 20;

  elementos.painelAlerta.className = emAlerta
    ? "painel-alerta alerta"
    : "painel-alerta normal";

  if (emAlerta) {
    elementos.iconeAlerta.textContent = "⚠️";
    elementos.tituloAlerta.textContent = "Nível baixo!";
    elementos.mensagemAlerta.textContent =
      "Atenção: o nível de água do reservatório está abaixo do limite recomendado.";
  } else {
    elementos.iconeAlerta.textContent = "✓";
    elementos.tituloAlerta.textContent = "Nível normal";
    elementos.mensagemAlerta.textContent =
      "O reservatório está funcionando normalmente.";
  }

  elementos.nivel.className = emAlerta
    ? "status-alerta"
    : "status-normal";
}


function atualizarNivel(leitura) {
  const nivel = Number(leitura.level_percent);
  const distancia = Number(leitura.distance_cm);

  elementos.nivel.textContent = nivel.toFixed(1);
  elementos.distancia.textContent = distancia.toFixed(2);

  elementos.barra.style.width =
    Math.max(0, Math.min(100, nivel)) + "%";

  atualizarAlerta(leitura);

  const data = new Date(leitura.created_at);
  elementos.data.textContent = formatarData(data);
  elementos.hora.textContent = formatarHora(data);
}



function atualizarHistorico(leituras) {
  elementos.total.textContent = leituras.length;
  elementos.historico.innerHTML = "";

  leituras.forEach((leitura) => {
    const nivel = Number(leitura.level_percent);
    const distancia = Number(leitura.distance_cm);
    const data = new Date(leitura.created_at);
    const emAlerta = leitura.alerta === true || nivel < 20;

    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${formatarData(data)} ${formatarHora(data)}</td>
      <td>ESP32_RESERVATORIO_01</td>
      <td>${nivel.toFixed(1)}%</td>
      <td>${distancia.toFixed(2)} cm</td>
      <td>
        <span class="${emAlerta ? "status-alerta" : "status-normal"}">
          ${emAlerta ? "Nível baixo" : "Normal"}
        </span>
      </td>
    `;

    elementos.historico.appendChild(linha);
  });
}


function atualizarGrafico(leituras) {
  const registros = [...leituras].reverse();

  const labels = registros.map((leitura) => {
    return formatarHora(new Date(leitura.created_at));
  });

  const valores = registros.map((leitura) => {
    return Number(leitura.level_percent);
  });

  const contexto = document.getElementById("grafico-historico");

  if (!grafico) {
    grafico = new Chart(contexto, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Nível do reservatório (%)",
          data: valores,
          borderColor: "#1685d1",
          backgroundColor: "rgba(22, 133, 209, 0.15)",
          borderWidth: 3,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Nível (%)"
            }
          },
          x: {
            title: {
              display: true,
              text: "Horário das leituras"
            }
          }
        }
      }
    });
  } else {
    grafico.data.labels = labels;
    grafico.data.datasets[0].data = valores;
    grafico.update();
  }
}

function verificarAtualizacao() {
  if (!ultimaLeitura) return;

  const idade = Date.now() - new Date(ultimaLeitura.created_at).getTime();

  if (idade > TEMPO_DADOS_DESATUALIZADOS) {
    atualizarConexao("offline", "Dados desatualizados");

    elementos.painelAlerta.className = "painel-alerta desatualizado";
    elementos.iconeAlerta.textContent = "⚠️";
    elementos.tituloAlerta.textContent = "Dados desatualizados";
    elementos.mensagemAlerta.textContent =
      "Não recebemos uma nova leitura do sensor recentemente.";
  }
}

async function buscarDados() {
  try {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
      throw new Error("Erro ao consultar a API.");
    }

    const dados = await resposta.json();
    const leituras = dados.leituras || [];

    if (leituras.length === 0) {
      atualizarConexao("offline", "Nenhuma leitura disponível");
      return;
    }

    ultimaLeitura = leituras[0];

    atualizarConexao("online", "Conectado");
    atualizarNivel(ultimaLeitura);
    atualizarHistorico(leituras);
    atualizarGrafico(leituras);

    verificarAtualizacao();

  } catch (erro) {
    console.error("Falha ao buscar dados:", erro);
    atualizarConexao("offline", "Sem conexão com a API");
  }
}

elementos.botao.addEventListener("click", buscarDados);

buscarDados();

setInterval(buscarDados, INTERVALO_ATUALIZACAO);

setInterval(verificarAtualizacao, 5000);
