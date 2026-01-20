# Teste Thera — Frontend & Backend

Stack completa para gerenciamento de produtos e pedidos com Frontend (Next.js + Drizzle) e Backend (NestJS + Prisma).

## 📋 Requisitos

- **Node.js 18+**
- **PostgreSQL** (local ou Docker)
- **Docker + Docker Compose** (recomendado)

## 🚀 Como subir (Docker)

### 1. Clone o repositório e navegue até a raiz

```bash
cd teste-thera
```

### 2. Inicie os containers

```bash
docker-compose up --build
```

Isso irá:
- **Frontend**: http://localhost:3005
- **Backend**: http://localhost:3001
- **Swagger (API Docs)**: http://localhost:3001/docs
- **PostgreSQL**: localhost:55432

## 💻 Como subir (Local)

### Backend (NestJS + Prisma)

```bash
cd backend

# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do PostgreSQL

# 3. Gere o cliente Prisma
npm run prisma:generate

# 4. Execute as migrações
npm run prisma:migrate

# 5. (Opcional) Execute seed para dados iniciais
npm run prisma:seed

# 6. Inicie o servidor
npm run start:dev
```

**Porta padrão**: 3001  
**Swagger**: http://localhost:3001/docs

### Frontend (Next.js + Drizzle)

```bash
cd frontend

# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env.local
# DATABASE_URL deve apontar para o PostgreSQL

# 3. Gere as migrações do Drizzle
npm run db:generate

# 4. Push das migrations para o banco
npm run db:push

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

**Porta padrão**: 3005

## 📖 Documentação da API

### Produtos

**GET** `/api/products` - Listar produtos com filtros
- Query params: `skip`, `take`, `searchName`, `minPrice`, `maxPrice`, `category`

**POST** `/api/products` - Criar novo produto
```json
{
  "name": "Notebook Dell",
  "category": "Eletrônicos",
  "description": "Notebook com processador Intel i7",
  "price": 3499.99,
  "imageUrl": "https://example.com/image.jpg",
  "stockQuantity": 10
}
```

**GET** `/api/products/:id` - Obter um produto

**PATCH** `/api/products/:id` - Atualizar produto

**DELETE** `/api/products/:id` - Deletar produto

**GET** `/api/products/categories` - Listar categorias

### Pedidos

**POST** `/api/orders` - Criar novo pedido
```json
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 1 }
  ]
}
```

**GET** `/api/orders` - Listar pedidos
- Query params: `skip`, `take`, `status` (Pendente, Concluído, Cancelado)

**GET** `/api/orders/:id` - Obter um pedido

**PATCH** `/api/orders/:id` - Atualizar status do pedido
```json
{
  "status": "Concluído"
}
```

**DELETE** `/api/orders/:id` - Deletar pedido

## 🧪 Testes

### Frontend (Next.js)

```bash
cd frontend

# Rodar todos os testes
npm test

# Rodar testes com coverage
npm test -- --coverage

# Rodar testes em watch mode
npm test -- --watch

# Gerar snapshots
npm test -- -u
```

**Arquivos de teste**:
- `__tests__/product-card.snapshot.test.tsx` - Snapshot dos cards de produtos
- `__tests__/product-filters.test.tsx` - Testes dos filtros

### Backend (NestJS)

```bash
cd backend

# Rodar todos os testes
npm test

# Rodar com coverage
npm test -- --coverage

# Rodar em watch mode
npm test -- --watch

# Rodar testes E2E
npm run test:e2e
```

**Arquivos de teste**:
- `src/products/products.service.spec.ts` - Testes do serviço de produtos
- `src/orders/orders.service.spec.ts` - Testes do serviço de pedidos

## 🏗️ Arquitetura e Escolhas

### Frontend

**Stack**: Next.js 15 + TypeScript + TailwindCSS + tRPC

- **tRPC**: Comunicação type-safe com o backend
- **Drizzle ORM**: Gerenciamento de banco de dados com migrations automáticas
- **React Hook Form**: Validação de formulários
- **Radix UI**: Componentes acessíveis e customizáveis

**Estrutura de pastas**:
```
src/
├── app/               # Páginas e rotas
├── components/        # Componentes reutilizáveis
│   └── products/      # Componentes específicos de produtos
├── hooks/             # Custom hooks React
├── lib/               # Utilitários e validadores
├── server/            # Código do servidor (tRPC routers)
│   ├── api/           # Routers tRPC
│   └── db/            # Schema do Drizzle
├── styles/            # CSS global
└── trpc/              # Cliente e setup do tRPC
```

### Backend

**Stack**: NestJS 10 + TypeScript + Prisma + PostgreSQL

- **Arquitetura em camadas**: Controllers → Services → Repositories (Prisma)
- **SOLID Principles**: Separação de responsabilidades, Inversão de dependência
- **Swagger**: Documentação automática da API
- **Validação com DTOs**: class-validator e class-transformer

**Estrutura de pastas**:
```
src/
├── products/          # Módulo de produtos
│   ├── dto/          # Data Transfer Objects
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── orders/            # Módulo de pedidos
├── prisma/            # Configuração do Prisma
├── auth/              # Autenticação e autorização
└── app.module.ts      # Módulo raiz
```

## 📝 Funcionalidades Implementadas

### ✅ Obrigatórias (Frontend)
- [x] Listar produtos com informações (nome, categoria, preço, descrição, imagem)
- [x] Formulário para cadastro de produtos
- [x] Filtro por nome e faixa de preço
- [x] Ordenação dos resultados
- [x] Paginação

### ✅ Obrigatórias (Backend)
- [x] CRUD de produtos
- [x] CRUD de pedidos
- [x] Validação de estoque ao criar pedidos
- [x] Atualização automática de estoque
- [x] Testes unitários (2+)

### ✅ Diferenciais
- [x] Paginação implementada
- [x] Layout responsivo com Tailwind
- [x] Testes de snapshot
- [x] Documentação com Swagger
- [x] Docker para ambiente

## 🔧 Variáveis de Ambiente

### Frontend (.env.local)
```
DATABASE_URL="postgresql://user:password@localhost:5432/thera_db"
NODE_ENV="development"
```

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/thera_db"
NODE_ENV="development"
JWT_SECRET="sua-chave-secreta"
```

## 📚 Recursos Adicionais

- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Drizzle Docs](https://orm.drizzle.team)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

## 📄 Licença

MIT

- Docker Compose com 3 serviços: PostgreSQL, NestJS Backend, Next.js Frontend.
- Zustand para state management do frontend.
