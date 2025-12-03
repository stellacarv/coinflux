# 🪙 CoinFlux

> **Monitoramento de Câmbio Full Stack (Node.js + MongoDB + Vanilla JS)**

O **CoinFlux** é uma aplicação web completa para consulta de cotações de moedas em tempo real e gerenciamento de histórico de conversões.

O projeto utiliza uma arquitetura **BFF (Backend for Frontend)** simplificada, onde um servidor Node.js atua como proxy seguro entre o cliente e a API externa, além de gerenciar a persistência de dados no MongoDB.

---

## 📸 Demonstração


https://github.com/user-attachments/assets/284c8b1a-3f71-40c9-988e-298432c6f2f9


---

## 🛠️ Arquitetura do Sistema

1.  **Frontend (Client):** Interface moderna desenvolvida em Vanilla JS. As requisições são enviadas ao nosso servidor local (`/api/last/...` e `/historico`), nunca expondo chaves ou lógica de banco de dados diretamente ao navegador.
2.  **Backend (Node.js Proxy & API):**
    * **Proxy:** Intermedia o contato com a **AwesomeAPI**, ocultando tokens e tratando CORS.
    * **API Própria:** Gerencia as rotas de histórico (Salvar, Listar, Limpar) conectadas ao MongoDB.
    * **Normalização:** Padroniza os dados recebidos antes de enviá-los ao front.
3.  **Banco de Dados (MongoDB):** Armazena o log completo das conversões realizadas para consulta futura.

---

## 🚀 Funcionalidades

* **Conversão em Tempo Real:** Cotações atualizadas instantaneamente via integração com AwesomeAPI.
* **Histórico Persistente:** Salva automaticamente cada conversão realizada no banco de dados.
* **Gestão de Dados:** Interface dedicada (`historico.html`) para visualizar e limpar o histórico de consultas.
* **Design Responsivo:** Interface adaptável com efeito *Glassmorphism* e gráficos interativos.
* **Segurança:** Uso de variáveis de ambiente (`.env`) para proteger credenciais e configurações sensíveis.

---

## 🧰 Tecnologias Utilizadas

### Backend
* **Node.js & Express:** Base do servidor e roteamento.
* **MongoDB & Mongoose:** Banco de dados NoSQL e modelagem de dados (Schema).
* **Node-fetch:** Cliente HTTP leve para requisições à API externa.
* **Dotenv:** Gerenciamento seguro de variáveis de ambiente.
* **Cors:** Controle de acesso HTTP.

### Frontend
* **HTML5 & CSS3:** Estrutura semântica e estilização avançada.
* **Vanilla JavaScript (ES6+):** Lógica de interação limpa, sem dependência de frameworks pesados.
* **Chart.js:** Biblioteca para renderização de gráficos de variação cambial.

---

## 📂 Estrutura do Projeto

```text
coinflux/
├── backend/
│   ├── config/
│   │   └── db.js          # Conexão com o MongoDB
│   ├── models/
│   │   └── historico.js   # Modelo (Schema) do Mongoose
│   ├── routes/
│   │   └── historicoRoutes.js # Rotas da API de histórico
│   └── server.js          # Ponto de entrada (Proxy + Servidor)
├── frontend/
│   ├── assets/
│   │   ├── img/           # Ícones e imagens
│   │   └── style.css      # Estilos globais
│   ├── coin.js            # Lógica de conversão e gráficos
│   ├── historico.html     # Página de visualização de logs
│   ├── historico.js       # Lógica da página de histórico
│   └── index.html         # Página principal
├── backups/               # Diretório para backups de segurança
├── .env                   # Variáveis de ambiente (ignorado pelo git)
└── package.json           # Dependências e scripts
```

## ⚙️ Instalação e Configuração

### Pré-requisitos
* Node.js instalado.
* MongoDB rodando (localmente ou via Atlas).

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/stellacarv/coinflux.git](https://github.com/stellacarv/coinflux.git)
    cd coinflux
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o ambiente:**
    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/coinflux
    AWESOME_TOKEN=seu_token_aqui  # Opcional, mas recomendado para evitar limites da API
    ```

4.  **Inicie o servidor:**
    ```bash
    npm start
    ```
    O servidor rodará em `http://localhost:3000`.

---

## 🔌 Documentação da API Interna

### 1. Cotação (Proxy)
* **GET** `/api/last/:pairs`
    * Busca a cotação atual para os pares informados (ex: `USD-BRL,EUR-BRL`).
    * Retorna JSON normalizado.

### 2. Histórico
* **POST** `/historico`
    * Salva uma nova conversão.
    * **Body:** `{ "moedaOrigem": "USD", "moedaDestino": "BRL", "valor": 5.50 }`
* **GET** `/historico`
    * Retorna a lista das últimas conversões salvas.
* **DELETE** `/historico`
    * Apaga todo o histórico do banco de dados.

---

## 📝 Licença

Este projeto está sob a licença **ISC**.
