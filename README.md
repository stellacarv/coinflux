# 🪙 CoinFlux

> **Monitoramento de Câmbio Full Stack (Node.js + Vanilla JS)**

O **CoinFlux** é uma aplicação web interativa para consulta de cotações de moedas globais em relação ao Real Brasileiro (BRL) em tempo real.

O diferencial deste projeto é sua arquitetura **Full Stack**. Diferente de simples páginas estáticas, o CoinFlux utiliza um servidor **Node.js** atuando como **Proxy API**. Isso garante segurança (ocultando chaves de API), resolve limitações de CORS e normaliza os dados antes de entregá-los ao Frontend.

---

## 📸 Demonstração


https://github.com/user-attachments/assets/63a3b525-8c5e-47e9-858c-90f67a6cda40

---

## 🛠️ Arquitetura do Sistema

O projeto segue o padrão **BFF (Backend for Frontend)** simplificado:

1.  **Frontend (Client):** O usuário interage com a interface. As requisições não vão direto para a API externa, mas sim para o nosso servidor local (`/api/last/...`).
2.  **Backend (Node.js Proxy):**
    * Recebe a requisição do Frontend.
    * Injeta o Token de autenticação (se necessário) via variáveis de ambiente (`.env`).
    * Consulta a **AwesomeAPI** e formata as chaves do JSON (ex: converte `USDBRL` para `USD-BRL`) para evitar erros no front.
    * **Normaliza os dados:** Garante consistência na estrutura de retorno das moedas.
3.  **Banco de Dados (MongoDB):** Armazena o histórico de conversões para persistência de dados além do navegador.
4.  **API Externa:** Fonte da verdade dos dados financeiros.

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
* **Node.js:** Ambiente de execução robusto para a aplicação.
* **Express:** Framework para roteamento, criação do servidor HTTP e gerenciamento de rotas.
* **MongoDB & Mongoose:** Banco de dados NoSQL e ODM para persistência do histórico de conversões.
* **Node-fetch:** Implementação de requisições HTTP estáveis e com respostas consistentes.
* **Organização do Projeto:**
    * Estrutura limpa com diretório de `backups` dedicado.
    * Configuração otimizada do `.gitignore` para manter o repositório organizado.
* **Tratamento de Erros:**
    * Blocos `try/catch` robustos para garantir que o servidor não pare.
    * Tratamento detalhado para moedas inexistentes e falhas de comunicação com a API externa.
* **Proxy Pattern:** Intermediação de requisições para ocultar tokens e tratar CORS.
* **Dotenv:** Gerenciamento seguro de variáveis de ambiente.
