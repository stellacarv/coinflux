# 🪙 CoinFlux

> **Monitoramento de Câmbio em Tempo Real (Base BRL)**

O **CoinFlux** é uma aplicação web Full Stack que permite aos usuários consultar a cotação de diversas moedas globais em relação ao Real Brasileiro (BRL). O sistema consome dados em tempo real de uma API externa, processa as informações no Backend e armazena histórico de consultas/cotações em um Banco de Dados.

---

## 📸 Demonstração
<img width="1280" height="632" alt="image" src="https://github.com/user-attachments/assets/6062750e-2087-40ca-94e9-d1a2e92edb55" />

---

## 🛠️ Arquitetura do Projeto

O projeto segue uma arquitetura cliente-servidor robusta:

1.  **Frontend:** Interface do usuário para seleção de moedas e visualização de dados.
2.  **Backend:** API própria que gerencia as requisições, comunica-se com a API de Câmbio externa e salva dados.
3.  **Banco de Dados:** Persistência de dados (histórico de cotações).
4.  **API Externa:** Fonte dos dados de câmbio.

---

## 🚀 Tecnologias Utilizadas

### Frontend
* **React / HTML&CSS**

### Backend
* **Node.js**
* **API RESTful**

### Banco de Dados
* **MongoDB**

### Integrações
* **API de Câmbio:** [AwesomeAPI / OpenExchangeRates]

---

## ✨ Funcionalidades

* ✅ **Cotação em Tempo Real:** Conversão instantânea de moedas (USD, EUR, etc.) para Reais (BRL).
* ✅ **Atualização Automática:** Busca os dados mais recentes a cada nova consulta.
* ✅ **Histórico de Consultas:** Registro das cotações pesquisadas no banco de dados.
* ✅ **Interface Responsiva:** Adaptável para mobile e desktop.

---

## 🗂️ Estrutura do Banco de Dados

Exemplo da tabela principal de cotações:

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | UUID/INT | Identificador único |
| `moeda_origem` | VARCHAR | Ex: USD |
| `valor_brl` | DECIMAL | Valor da cotação no momento |
| `data_consulta` | TIMESTAMP | Data e hora da requisição |

---
