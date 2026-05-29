# DevTracker

DevTracker é uma aplicação full-stack para gerenciamento de produtividade de desenvolvedores, combinando:

- **Backend**: Spring Boot 4 + Spring MVC + Spring Data JPA + PostgreSQL + Flyway + JWT + GitHub OAuth
- **Frontend**: React 19 + Vite + Tailwind CSS + React Router + Axios

O projeto permite registro/login, controle de metas, tarefas, sessões de foco, visão geral de desempenho e análise de GitHub.

---

## Objetivo

Criar um painel de produtividade que ajude desenvolvedores a:

- registrar e acompanhar metas e tarefas
- controlar sessões de foco
- visualizar um panorama do progresso diário e semanal
- integrar métricas do GitHub para análise de contribuição e linguagens
- autenticar com conta local ou GitHub

---

## Arquitetura

### Backend (`back-end`)

- **Spring Boot 4** com `spring-boot-starter-parent`
- **Persistência**: Spring Data JPA + PostgreSQL
- **Migrações**: Flyway
- **Segurança**: Spring Security + JWT + OAuth2 GitHub customizado
- **API REST** com controladores para:
  - `/auth` — registro, login, GitHub OAuth
  - `/user` — perfil, atualização, senha, exclusão
  - `/focus` — controle de sessões de foco
  - `/goal` — metas do usuário
  - `/task` — tarefas relacionadas às metas
  - `/session` — sessões de trabalho e desempenho
  - `/overview` — visão geral personalizada
  - `/github` — analytics do GitHub, dados de commit, linguagens e repos
  - `/admin` — endpoints de administração e auditoria

### Frontend (`front-end`)

- **Vite** para bundling e desenvolvimento rápido
- **React 19** com **BrowserRouter**
- **Tailwind CSS** para estilos utilitários
- **Axios** para chamadas à API backend
- **Autenticação JWT** no `Authorization: Bearer` header

Rotas principais:

- `/` — Landing Page
- `/register` — cadastro local
- `/login` — login local
- `/auth/callback` — callback de OAuth GitHub
- `/dashboard22` — dashboard privado
- `/profileedit22` — edição de perfil privado

---

## Conteúdo do repositório

- `back-end/` — aplicação Spring Boot
- `front-end/` — aplicação React/Vite
- `documentation/deployment_guide.md` — guia de deploy recomendado
- `front-end/vercel.json` — configuração de roteamento para Vercel

---

## Instalação e execução local

### Backend

1. Navegue até a pasta do backend:
   ```bash
   cd back-end
   ```
2. Execute o Maven wrapper:
   ```bash
   ./mvnw clean package -DskipTests
   ```
3. Execute a aplicação:
   ```bash
   java -jar target/back-end-0.0.1-SNAPSHOT.jar
   ```

A aplicação usa por padrão `http://localhost:8080` e lê `server.port=${PORT:8080}`.

### Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd front-end
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Inicie em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

Por padrão, o frontend busca a API em `http://localhost:8080` quando `VITE_API_URL` não está definido.

---

## Variáveis de ambiente importantes

### Backend

A aplicação backend depende destas variáveis em produção:

- `SPRING_PROFILES_ACTIVE=prod`
- `PORT` — porta fornecida pelo serviço de hospedagem
- `DEVTRACKER_DB_URL` — URL JDBC PostgreSQL, por exemplo `jdbc:postgresql://host/db?sslmode=require`
- `DEVTRACKER_DB_USERNAME`
- `DEVTRACKER_DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION` (padrão: `3600000`)
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_OAUTH_REDIRECT_URI` — callback do backend para GitHub OAuth
- `GITHUB_TOKEN_ENCRYPTION_SECRET`
- `FRONTEND_AUTH_CALLBACK_URL` — callback front-end após GitHub OAuth
- `DEVTRACKER_CORS_ALLOWED_ORIGINS` — origens permitidas para CORS
- `DEVTRACKER_ADMIN_EMAILS`
- `FLYWAY_ENABLED=true`
- `JPA_DDL_AUTO=validate`

### Frontend

- `VITE_API_URL` — API backend pública
- `VITE_ADMIN_EMAILS` — e-mails de administradores para a UI

---

## Deploy recomendado

O repositório inclui uma documentação dedicada em `documentation/deployment_guide.md` com a arquitetura desejada:

- Frontend em **Vercel**
- Backend em **Render**
- Banco de dados em **Neon PostgreSQL**
- GitHub OAuth configurado para redirecionar no backend e retornar para o frontend

---

## Desenvolvimento e testes

### Backend

- Build: `./mvnw clean package`
- Testes: `./mvnw test`

### Frontend

- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

---

## Notas adicionais

- A aplicação backend usa **JWT** para autenticação sem sessão e um filtro `JwtAuthenticationFilter` para validar tokens nas requisições protegidas.
- O fluxo de GitHub OAuth é tratado por `back-end/src/main/java/org/danielbreves/backend/controller/AuthController.java`.
- O frontend armazena o token no cliente e redireciona para `/login` em caso de `401`.

---

## Aprimoramentos possíveis

- adicionar documentação de API OpenAPI / Swagger
- melhorar a UX de erros de login / registro
- adicionar cobertura de testes automatizados no frontend
- externalizar as configurações de ambiente em um `.env.example`
