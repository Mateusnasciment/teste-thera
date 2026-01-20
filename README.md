# Teste Thera — Frontend & Backend

Stack pronta para rodar em Docker ou local, com catálogo de produtos (Next.js) e API (NestJS + Prisma). README enxuto para você subir rápido e saber onde testar.

## Pré-requisitos
- Node 18+
- Docker + Docker Compose (recomendado)

## Como subir (Docker)
```
docker compose up --build
```
- Frontend: http://localhost:3005
- Backend / Swagger: http://localhost:3001/docs
- Postgres (local): porta 55432

## Como subir (local)
### Frontend (Next.js 14)
```
cd frontend
npm install
npm run dev
```
- Catálogo com filtros/ordenar/paginar, formulário com validação, imagens reais (FakeStore + Unsplash fallback)
- Estado global: `src/store/products.ts`
- API client: `src/lib/api.ts`
- UI: `src/components/`

### Backend (NestJS 10 + Prisma)
```
cd backend
npm install
cp .env.example .env   # ajuste DATABASE_URL
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```
- Swagger: http://localhost:3001/docs
- Auth demo: POST /api/auth/login com `admin@example.com` / `admin123`

## Testes
- **Jest (snapshots rápidos)**: `npm test -- __tests__/snapshots.test.ts --no-coverage`
- **Jest (restante)**: `npm test`
- **Playwright (visual)**: `npm run test:e2e` (precisa do frontend rodando)

## O que mudou recentemente
- Catálogo ampliado (26 itens, múltiplas categorias) com campos sênior: SKU, brand, rating, stock, reviewCount.
- Imagens via FakeStore + fallback Unsplash, `next.config.js` com `unoptimized: true` para externas.
- UI refinada: header com métricas, cards com badge de estoque, filtros avançados, paginação.
- Testes de snapshot documentados em `TESTING.md` (Jest + Playwright).
- Docker Compose com 3 serviços: PostgreSQL, NestJS Backend, Next.js Frontend.
- Zustand para state management do frontend.
