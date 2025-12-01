let chart;

// Moedas disponíveis
const moedas = {
  'USD': 'Dólar Americano',
  'EUR': 'Euro',
  'GBP': 'Libra Esterlina',
  'ARS': 'Pesos Argentino',
  'JPY': 'Iene Japonês',
  'CNY': 'Yuan Chinês',
  'CAD': 'Dólar Canadense',
  'AUD': 'Dólar Australiano',
  'CHF': 'Franco Suíço',
  'SEK': 'Coroa Sueca',
  'NZD': 'Dólar Neozelandês',
  'MXN': 'Peso Mexicano'
};

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
    const url = `https://economia.awesomeapi.com.br/json/last/${moeda}-BRL`;
    console.log('Chamando API:', url);
    const resp = await fetch(url);

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Erro da API:', resp.status, text);
      throw new Error(`HTTP ${resp.status}`);
    }

    const dados = await resp.json();
    const key = `${moeda}BRL`;
    
    if (!dados[key]) {
      console.error('Resposta inesperada:', dados);
      throw new Error('Chave não encontrada');
    }

    const cotacao = Number(dados[key].bid);
    const convertido = (valor * cotacao).toFixed(2);

    // Salva no histórico
    salvarNoHistorico(valor, moeda, convertido, cotacao);

    box.style.display = "block";
    box.innerHTML = `💱 ${valor} ${moeda} equivale a <strong>R$ ${convertido}</strong> (BRL)`;
  } catch (e) {
    console.error('Erro consultar():', e);
    box.style.display = "block";
    box.innerHTML = "Erro ao buscar cotação. Tente novamente.";
  }
}

// Salva conversão no localStorage
function salvarNoHistorico(valor, moeda, resultado, taxa) {
  let historico = JSON.parse(localStorage.getItem('historico')) || [];
  
  const agora = new Date();
  const data = agora.toLocaleString('pt-BR');

  const entrada = {
    valor,
    moeda,
    resultado,
    taxa: taxa.toFixed(2),
    data
  };

  historico.push(entrada);
  
  if (historico.length > 50) {
    historico = historico.slice(-50);
  }

  localStorage.setItem('historico', JSON.stringify(historico));
  console.log('Histórico salvo:', entrada);
  
  // Atualiza exibição se estiver em historico.html
  displayHistorico();
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
  const canvas = document.getElementById("currencyChart");
  if (!canvas) return;

  const { labels, values } = await getCurrencyHistory(currency);
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
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            count: 6,
          }
        }
      }
    }
  });
}

// Busca múltiplas moedas de uma vez
async function fetchMultipleCurrencies(currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'MXN']) {
  try {
    const pares = currencies.map(c => `${c}-BRL`).join(',');
    const url = `https://economia.awesomeapi.com.br/json/last/${pares}`;
    const resp = await fetch(url);
    const dados = await resp.json();
    return dados;
  } catch (err) {
    console.error('Erro ao buscar múltiplas moedas:', err);
    return {};
  }
}

// Exibe cards com valores das moedas em tempo real
async function displayCurrencies() {
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'MXN'];
  const dados = await fetchMultipleCurrencies(currencies);
  const grid = document.getElementById("currenciesGrid");
  
  if (!grid) return;
  
  grid.innerHTML = '';
  currencies.forEach(moeda => {
    const key = `${moeda}BRL`;
    if (dados[key]) {
      const cotacao = Number(dados[key].bid);
      const variacao = Number(dados[key].pctChange);
      const corVariacao = variacao >= 0 ? '#00aa00' : '#ff0000';
      
      grid.innerHTML += `
        <div class="currency-card" onclick="document.getElementById('moedaSelect').value='${moeda}'; updateChart('${moeda}');">
          <h3>${moeda}</h3>
          <p class="value">R$ ${cotacao.toFixed(2)}</p>
          <p class="variation" style="color: ${corVariacao}">
            ${variacao >= 0 ? '↑' : '↓'} ${Math.abs(variacao).toFixed(2)}%
          </p>
        </div>
      `;
    }
  });
}

// Função de busca com sugestões
function searchCurrency() {
  const searchInput = document.getElementById('searchInput');
  const resultsDiv = document.getElementById('searchResults');
  const searchTerm = searchInput.value.toLowerCase();

  if (!searchTerm) {
    resultsDiv.innerHTML = '';
    return;
  }

  const resultados = Object.entries(moedas).filter(([code, name]) => 
    code.toLowerCase().includes(searchTerm) || name.toLowerCase().includes(searchTerm)
  );

  resultsDiv.innerHTML = resultados.map(([code, name]) => `
    <div class="search-result-item" onclick="selectCurrency('${code}')">
      <strong>${code}</strong> - ${name}
    </div>
  `).join('');
}

function selectCurrency(code) {
  document.getElementById('moedaSelect').value = code;
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
  updateChart(code);
}

// Histórico
function displayHistorico() {
  const historico = JSON.parse(localStorage.getItem('historico')) || [];
  const historicoDiv = document.getElementById('historico');
  const vazioDiv = document.getElementById('vazio');

  if (!historicoDiv) return;

  if (historico.length === 0) {
    historicoDiv.style.display = 'none';
    if (vazioDiv) vazioDiv.style.display = 'block';
    return;
  }

  historicoDiv.style.display = 'block';
  if (vazioDiv) vazioDiv.style.display = 'none';

  historicoDiv.innerHTML = historico.map((item, idx) => `
    <div class="historico-item">
      <div class="historico-info">
        <span class="historico-data">${item.data}</span>
        <span class="historico-conversao">
          <strong>${item.valor}</strong> ${item.moeda} = <strong>R$ ${item.resultado}</strong>
        </span>
        <span class="historico-taxa">(Taxa: R$ ${item.taxa})</span>
      </div>
      <button class="btn-remove" onclick="removerDoHistorico(${idx})">❌</button>
    </div>
  `).join('');
}

function removerDoHistorico(idx) {
  let historico = JSON.parse(localStorage.getItem('historico')) || [];
  historico.splice(idx, 1);
  localStorage.setItem('historico', JSON.stringify(historico));
  displayHistorico();
}

// Utilitário debounce
function debounce(fn, ms = 200) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// Menu hambúrguer
function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.classList.toggle("open");
}

// Gráfico carrega automaticamente ao abrir a página
window.addEventListener("DOMContentLoaded", () => {
  const moeda = document.getElementById("moedaSelect").value;
  updateChart(moeda);
});

function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.classList.toggle("open");
}
// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Index
  const btnConsultar = document.getElementById("btnConsultar");
  if (btnConsultar) {
    btnConsultar.addEventListener("click", consultar);
  }

  const moedaSelect = document.getElementById("moedaSelect");
  if (moedaSelect) {
    moedaSelect.addEventListener("change", debounce((e) => {
      updateChart(e.target.value);
    }, 250));
    updateChart(moedaSelect.value);
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(searchCurrency, 200));
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
      const resultsDiv = document.getElementById('searchResults');
      if (resultsDiv) resultsDiv.innerHTML = '';
    }
  });

  // Histórico
  const btnLimpar = document.getElementById('btnLimpar');
  if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
        localStorage.removeItem('historico');
        displayHistorico();
      }
    });
  }

  displayHistorico();
  displayCurrencies();
  
  setInterval(displayCurrencies, 30000);
});
