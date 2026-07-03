# ✈️ Institutional Trip Requests API (pbak-aval2)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

Este repositório contém a avaliação da disciplina de Programação Back-end. Trata-se de uma API RESTful para o gerenciamento de solicitações de viagens institucionais, construída com TypeScript, Express e Prisma.

## Equipe:
- Felipe Martins dos Santos Silva
- Jordan Fernandes de Carvalho
- Henrique Veras Cordeiro
- Vitor dos Santos Correia

## 📌 Regras de Negócio Implementadas

A API garante a integridade das solicitações aplicando as seguintes validações:
1. **Quantidade de Passageiros:** A viagem deve ter pelo menos 1 passageiro (`passengerCount > 0`).
2. **Coerência de Datas:** A data de retorno não pode ser anterior à data de partida.
3. **Bloqueio de Feriados:** A data de partida **não pode** coincidir com um feriado nacional. Esta validação é feita de forma dinâmica, integrando-se à [BrasilAPI](https://brasilapi.com.br/).
4. **Respostas Padronizadas:** Todos os endpoints retornam dados seguindo o formato rigoroso `{"success": true/false, ...}`. Erros internos do servidor nunca são expostos ao cliente.

---

## 🚀 Como Executar o Projeto Localmente

Para rodar o projeto na sua máquina, você precisará ter o **Node.js** (v18+) e o **Docker** instalados. 

Abra o seu terminal, clone o repositório e siga exatamente os passos abaixo:

### 1. Instalar as dependências
```bash
npm install
```
### 2. Configurar as Variáveis de Ambiente

Crie o arquivo de ambiente local baseando-se no arquivo de exemplo fornecido no repositório:
```bash
cp .env.example .env
```
### 3. Subir o Banco de Dados (MySQL via Docker)

A aplicação requer um banco de dados rodando na porta 3306. O docker-compose fará isso automaticamente em segundo plano:
```bash
docker compose up -d
```
### 4. Sincronizar e Popular o Banco de Dados

Sincronize o schema do Prisma com o banco e popule as tabelas com os registros iniciais obrigatórios (seed idempotente):
```bash
npx prisma db push
npm run init:db
```
### 5. Iniciar o Servidor

Inicie a aplicação em modo de desenvolvimento (o servidor rodará na porta 3000 e aplicará hot-reload a cada alteração):
```bash
npm run dev
```

## 🛣️ Endpoints Disponíveis

Com o servidor rodando (http://localhost:3000), as seguintes rotas estão disponíveis:
Viagens (Trip Requests)

    GET /trip-requests - Lista todas as solicitações de viagem.

    GET /trip-requests/:id - Retorna os detalhes de uma viagem específica.

    POST /trip-requests - Cria uma nova solicitação (aplica validação de datas e feriados).

Utilitários

    GET /holidays/:year - Consulta a BrasilAPI e retorna os feriados nacionais de um ano específico.

## 🛠️ Tratamento de Erros

A API possui um Middleware global que intercepta exceções. Erros de validação e regras de negócio retornarão status como 400 Bad Request ou 404 Not Found, com códigos internos descritivos (ex: HOLIDAY_TRIP_NOT_ALLOWED).

