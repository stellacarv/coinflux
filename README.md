# 🪙 CoinFlux

> **Monitoramento de Câmbio Full Stack (Node.js + Vanilla JS)**

O **CoinFlux** é uma aplicação web interativa para consulta de cotações de moedas globais em relação ao Real Brasileiro (BRL) em tempo real.

O diferencial deste projeto é sua arquitetura **Full Stack**. Diferente de simples páginas estáticas, o CoinFlux utiliza um servidor **Node.js** atuando como **Proxy API**. Isso garante segurança (ocultando chaves de API), resolve limitações de CORS e normaliza os dados antes de entregá-los ao Frontend.

---

## 📸 Demonstração

![COINFLUX](https://github.com/user-attachments/assets/4811fd2a-7d3b-4fcc-a6c9-cdbe8c5cfbd8)

---

## 🛠️ Arquitetura do Sistema

O projeto segue o padrão **BFF (Backend for Frontend)** simplificado:

1.  **Frontend (Client):** O usuário interage com a interface. As requisições não vão direto para a API externa, mas sim para o nosso servidor local (`/api/last/...`).
2.  **Backend (Node.js Proxy):**
    * Recebe a requisição do Frontend.
    * Injeta o Token de autenticação (se necessário) via variáveis de ambiente (`.env`).
    * Consulta a **AwesomeAPI**.
    * **Normaliza os dados:** Padroniza as chaves do JSON (ex: converte `USDBRL` para `USD-BRL`) para evitar erros no front.
3.  **API Externa:** Fonte da verdade dos dados financeiros.

---

## 🚀 Tecnologias e Conceitos Aplicados

### 🎨 Frontend (Interface & UX)
Desenvolvido com **Vanilla JS** moderno, focando em performance e sem dependência de frameworks pesados.

* **HTML5 Semântico:** Estrutura acessível e organizada.
* **CSS3 Avançado:**
    * **Glassmorphism:** Uso de `backdrop-filter: blur()` e transparências para visual moderno.
    * **CSS Grid & Flexbox:** Para layouts responsivos e alinhamento do grid de moedas.
    * **Animações:** `@keyframes` para suavizar a entrada de elementos.
    * **Responsividade:** Menu Hambúrguer e adaptação total para mobile.
* **JavaScript (ES6+):**
    * **Debounce Pattern:** Otimização da barra de busca para reduzir chamadas excessivas.
    * **Async/Await & Fetch:** Consumo assíncrono da API do Backend.
    * **LocalStorage:** Persistência do histórico de conversões no navegador do usuário.
    * **Chart.js:** Integração de biblioteca para renderização de gráficos interativos.

### ⚙️ Backend (Servidor & API)
* **Node.js:** Ambiente de execução.
* **Express:** Framework para roteamento e criação do servidor HTTP.
* **Proxy Pattern:** Intermediação de requisições para ocultar tokens e tratar CORS.
* **Dotenv:** Gerenciamento seguro de variáveis de ambiente.
* **Tratamento de Erros:** Blocos `try/catch` robustos para garantir que o servidor não pare em caso de falha da API externa.

---

## 📂 Estrutura de Pastas

```text
/
├── frontend/           # Arquivos estáticos servidos pelo Express
│   ├── assets/
│   │   └── style.css   # Estilização global
│   ├── coin.js         # Lógica do cliente
│   ├── index.html      # Dashboard principal
│   └── historico.html  # Página de histórico
├── .env                # Variáveis de ambiente (Token e Porta)
├── server.js           # Servidor Node.js (Proxy API)
├── package.json        # Gerenciamento de dependências
└── README.md           # Documentação
