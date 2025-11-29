let chart;

// Função principal de cotação
async function consultar() {
  const moeda = document.getElementById("moedaSelect").value;
  const valor = Number(document.getElementById("valorInput").value);
  const box = document.getElementById("resultado");

  if (!valor || valor <= 0) {
    box.style.display = "block";
    box.innerHTML = "Digite um valor válido.";
    return;
  }

  try {
    const url = `/api/last/${moeda}-BRL`;
    console.log('Chamando proxy:', url);
    const resp = await fetch(url);

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Erro do proxy:', resp.status, text);
      throw new Error(`Proxy HTTP ${resp.status}`);
    }

    const dados = await resp.json();
    const key = `${moeda}-BRL`;
    if (!dados[key]) {
      console.error('Resposta inesperada da API:', dados);
      throw new Error('Resposta sem chave esperada');
    }

    const cotacao = Number(dados[key].bid);
    const convertido = (valor * cotacao).toFixed(2);

    box.style.display = "block";
    box.innerHTML = `💱 ${valor} ${moeda} equivale a <strong>R$ ${convertido}</strong> (BRL)`;
  } catch (e) {
    console.error('Erro consultar():', e);
    box.style.display = "block";
    box.innerHTML = "Erro ao buscar cotação. Tente novamente.";
  }
}

// Obtém histórico dos últimos 30 dias
async function getCurrencyHistory(currency) {
  const url = `https://economia.awesomeapi.com.br/json/daily/${currency}-BRL/30`;
  const response = await fetch(url);
  const data = await response.json();

  const labels = data.map(item => {
    const date = new Date(item.timestamp * 1000);
    return date.toLocaleDateString("pt-BR");
  }).reverse();

  const values = data.map(item => Number(item.bid)).reverse();

  return { labels, values };
}

// Cria/atualiza o gráfico
async function updateChart(currency) {
  const { labels, values } = await getCurrencyHistory(currency);

  const canvas = document.getElementById("currencyChart");
  const ctx = canvas.getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `Variação do ${currency} para BRL (últimos 30 dias)`,
        data: values,
        borderWidth: 2,
        borderColor: "#3ab7ff",
        backgroundColor: "rgba(58,183,255,0.25)",
        pointRadius: 0,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

// Botão só faz conversão
document.getElementById("btnConsultar").addEventListener("click", () => {
  consultar();
});

// Gráfico carrega automaticamente ao abrir a página
window.addEventListener("DOMContentLoaded", () => {
  const moeda = document.getElementById("moedaSelect").value;
  updateChart(moeda);
});