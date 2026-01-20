# 🚀 Guia de Setup - Teste Thera

## ⚠️ Pré-requisitos

Certifique-se de ter instalado:

- **Node.js 18+**: [Download](https://nodejs.org/)
- **PostgreSQL 15+**: [Download](https://www.postgresql.org/)
- **Docker + Docker Compose** (opcional): [Download](https://www.docker.com/)

Verifique as versões:
```bash
node --version  # v18.x ou superior
npm --version   # 9.x ou superior
psql --version  # 15.x ou superior
docker --version # 24.x ou superior
docker-compose --version # 2.x ou superior
```

---

## 📦 Opção 1: Setup com Docker (Recomendado)

### Passo 1: Clone o repositório

```bash
git clone <seu-repo-url>
cd teste-thera
```

### Passo 2: Inicie os containers

```bash
docker-compose up --build
```

Aguarde até ver:
```
✓ PostgreSQL rodando em localhost:55432
✓ Backend rodando em http://localhost:3001
✓ Frontend rodando em http://localhost:3005
```

### Passo 3: Acesse a aplicação

- **Frontend**: http://localhost:3005
- **Backend Swagger**: http://localhost:3001/docs
- **Banco de Dados**: `postgresql://postgres:postgres@localhost:55432/thera_db`

### Passo 4: Popular dados (opcional)

```bash
# No backend
docker-compose exec backend npm run prisma:seed
```

---

## 💻 Opção 2: Setup Local

### Backend

#### Passo 1: Instale dependências

```bash
cd backend
npm install
```

#### Passo 2: Configure o banco de dados

**Crie um arquivo `.env`:**

```env
DATABASE_URL="postgresql://seu-usuario:sua-senha@localhost:5432/thera_db"
NODE_ENV="development"
JWT_SECRET="sua-chave-secreta-aqui"
```

**Ou use o Docker só para o PostgreSQL:**

```bash
docker run -d \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=thera_db \
  -p 5432:5432 \
  postgres:15
```

#### Passo 3: Configure o banco

```bash
# Gere o cliente Prisma
npm run prisma:generate

# Execute as migrations
npm run prisma:migrate

# (Opcional) Popular com dados iniciais
npm run prisma:seed
```

#### Passo 4: Inicie o servidor

```bash
npm run start:dev
```

Deverá aparecer:
```
[Nest] 12345  - 20/01/2025, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 20/01/2025, 10:30:01 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
```

**Backend rodando em**: http://localhost:3001  
**Swagger em**: http://localhost:3001/docs

---

### Frontend

#### Passo 1: Instale dependências

```bash
cd frontend
npm install
```

#### Passo 2: Configure o banco

**Crie um arquivo `.env.local`:**

```env
DATABASE_URL="postgresql://seu-usuario:sua-senha@localhost:5432/thera_db"
NODE_ENV="development"
```

#### Passo 3: Configure o banco com Drizzle

```bash
# Gere as migrations
npm run db:generate

# Push para o banco
npm run db:push
```

#### Passo 4: Inicie o servidor

```bash
npm run dev
```

Deverá aparecer:
```
> frontend@0.1.0 dev
> next dev --turbo

  ▲ Next.js 15.2.3
  ▲ Local:        http://localhost:3000
```

**Frontend rodando em**: http://localhost:3000

---

## 🧪 Rodando os Testes

### Backend

```bash
cd backend

# Todos os testes
npm test

# Com coverage
npm test -- --coverage

# Em watch mode
npm test -- --watch

# Apenas um arquivo
npm test -- products.service.spec.ts
```

**Esperado**:
```
 PASS  src/products/products.service.spec.ts
  ProductsService
    ✓ should be defined
    ✓ should create a product
    ✓ should return an array of products
    ✓ should filter by search name
    ✓ should return a single product
```

### Frontend

```bash
cd frontend

# Todos os testes
npm test

# Com coverage
npm test -- --coverage

# Gerar/atualizar snapshots
npm test -- -u

# Em watch mode
npm test -- --watch
```

**Esperado**:
```
PASS  __tests__/product-card.snapshot.test.tsx
  ProductCard Snapshot
    ✓ should match snapshot with full product info
    ✓ should match snapshot with product out of stock
    ✓ should match snapshot without image
    ✓ should match snapshot without description

PASS  __tests__/product-filters.test.tsx
  ProductFilters
    ✓ should render all filter fields
    ✓ should call onSearchChange when search input changes
    ✓ should call onMinPriceChange when min price changes
```

---

## 🔧 Troubleshooting

### Erro: "Connection refused"

**Problema**: Banco de dados não está rodando

**Solução**:
```bash
# Verifique se o PostgreSQL está rodando
psql -U postgres -d postgres

# Ou use Docker
docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15
```

### Erro: "EADDRINUSE: address already in use :::3001"

**Problema**: Porta 3001 já está sendo usada

**Solução**:
```bash
# Encontre o processo
lsof -i :3001

# Encerre o processo
kill -9 <PID>

# Ou use uma porta diferente
PORT=3002 npm run start:dev
```

### Erro: "NODE_ENV not defined"

**Problema**: Variáveis de ambiente não foram carregadas

**Solução**:
```bash
# No backend
export NODE_ENV=development

# No frontend (.env.local não tem NODE_ENV por padrão)
```

### Migrations não foram aplicadas

**Solução**:

**Backend (Prisma)**:
```bash
cd backend
npm run prisma:migrate -- --name migration_name
npm run prisma:generate
```

**Frontend (Drizzle)**:
```bash
cd frontend
npm run db:generate
npm run db:push
```

---

## 📝 Testando a API

### Com cURL

```bash
# Listar produtos
curl http://localhost:3001/api/products

# Criar produto
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook",
    "category": "Eletrônicos",
    "price": 3499.99,
    "stockQuantity": 10
  }'

# Criar pedido
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "productId": 1, "quantity": 2 }
    ]
  }'
```

### Com Swagger (UI)

Acesse: http://localhost:3001/docs

Teste todos os endpoints diretamente na interface.

### Com Postman

Importe a coleção:
```json
{
  "info": {
    "name": "Teste Thera API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Products",
      "item": [
        {
          "name": "List Products",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/products"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001"
    }
  ]
}
```

---

## ✅ Checklist de Setup

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL rodando
- [ ] Docker instalado (opcional)
- [ ] Repositório clonado
- [ ] Dependências instaladas (frontend + backend)
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations executadas
- [ ] Backend rodando (localhost:3001)
- [ ] Frontend rodando (localhost:3005 ou 3000)
- [ ] Testes passando
- [ ] Swagger acessível

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique se todas as portas estão disponíveis
2. Limpe node_modules e reinstale: `rm -rf node_modules && npm install`
3. Reinicie o Docker: `docker-compose down && docker-compose up --build`
4. Verifique os logs: `docker-compose logs -f`
5. Consulte a [Documentação Técnica](./ARCHITECTURE.md)

---

## 🎯 Próximos Passos

Após o setup completo:

1. Explore a API em http://localhost:3001/docs
2. Crie alguns produtos na interface
3. Crie pedidos e veja o estoque sendo atualizado
4. Execute os testes: `npm test`
5. Leia a [Arquitetura](./ARCHITECTURE.md) para entender o projeto

**Divirta-se codando! 🚀**
