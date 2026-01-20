# Documentação Técnica - Teste Thera

## 🎯 Visão Geral

Esta é uma aplicação completa de gerenciamento de produtos e pedidos com:
- **Frontend**: Next.js 15 com TypeScript e TailwindCSS
- **Backend**: NestJS 10 com Prisma ORM
- **Banco de dados**: PostgreSQL

## 🏗️ Arquitetura Geral

```
┌─────────────────────┐
│   Next.js Frontend  │
│   (Drizzle ORM)     │
└──────────┬──────────┘
           │
           │ tRPC
           │
┌──────────▼──────────┐
│  NestJS Backend     │
│  (Prisma ORM)       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│    PostgreSQL       │
└─────────────────────┘
```

## 📦 Frontend Architecture

### Estrutura de Pastas

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raiz
│   │   ├── page.tsx                # Redireciona para dashboard
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Layout do dashboard
│   │   │   ├── page.tsx            # Dashboard home
│   │   │   ├── products/
│   │   │   │   └── page.tsx        # Página de produtos
│   │   │   ├── tasks/
│   │   │   └── users/
│   │   └── api/                    # API routes (tRPC, auth)
│   ├── components/
│   │   ├── products/               # Componentes de produtos
│   │   │   ├── product-card.tsx    # Card individual do produto
│   │   │   ├── product-filters.tsx # Filtros de busca
│   │   │   ├── product-form-dialog.tsx # Modal de criação/edição
│   │   │   └── index.ts
│   │   ├── ui/                     # Componentes de UI (Shadcn)
│   │   ├── layout/                 # Componentes de layout
│   │   └── tasks/
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── utils.ts                # Funções utilitárias
│   │   ├── validators.ts           # Validadores Zod
│   │   └── errors.ts
│   ├── server/
│   │   ├── api/
│   │   │   ├── root.ts             # Root router tRPC
│   │   │   ├── routers/
│   │   │   │   ├── products.ts     # Router de produtos
│   │   │   │   ├── tasks.ts
│   │   │   │   └── post.ts
│   │   │   └── trpc.ts             # Setup tRPC
│   │   └── db/
│   │       ├── schema.ts           # Schema Drizzle
│   │       └── index.ts
│   ├── styles/
│   │   └── globals.css
│   ├── trpc/
│   │   ├── server.ts               # Servidor tRPC
│   │   ├── react.tsx               # Cliente tRPC React
│   │   └── query-client.ts
│   └── env.js                      # Validação de variáveis
├── __tests__/
│   ├── product-card.snapshot.test.tsx
│   └── product-filters.test.tsx
├── drizzle/
│   ├── migrations/                 # Arquivos SQL
│   └── meta/
├── jest.config.js
├── jest.setup.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

### Fluxo de Dados (Frontend)

1. **Página de Produtos** (`dashboard/products/page.tsx`)
   - Chama `api.products.list.useQuery()` do tRPC
   - Gerencia filtros e paginação com `useState`

2. **Componentes**
   - `ProductCard`: Renderiza cada produto
   - `ProductFilters`: Formulário de filtros
   - `ProductFormDialog`: Modal para criar/editar produto

3. **Mutações**
   - `api.products.create.useMutation()` - Criar produto
   - `api.products.update.useMutation()` - Editar produto
   - `api.products.delete.useMutation()` - Deletar produto

4. **Router tRPC** (`server/api/routers/products.ts`)
   - `list`: Busca com filtros e paginação
   - `getById`: Busca um produto
   - `create`: Cria novo produto
   - `update`: Atualiza produto
   - `delete`: Deleta produto
   - `getCategories`: Lista categorias únicas

### Banco de Dados (Drizzle)

**Tabelas**:
- `t3-app_product`: Armazena produtos
  - id, name, category, description, price, imageUrl, stockQuantity
  - Índices: category, price, name

### Validação (Zod)

Os DTOs são validados com Zod:
```typescript
const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.number().positive("Preço deve ser positivo"),
  // ...
});
```

## 🖥️ Backend Architecture

### Estrutura de Pastas

```
backend/
├── src/
│   ├── main.ts                     # Entry point
│   ├── app.module.ts               # Módulo raiz
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── products.controller.ts  # Endpoints HTTP
│   │   ├── products.service.ts     # Lógica de negócio
│   │   ├── products.module.ts      # Módulo
│   │   └── products.service.spec.ts
│   ├── orders/
│   │   ├── dto/
│   │   │   ├── create-order.dto.ts
│   │   │   └── update-order.dto.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts       # Lógica de estoque
│   │   ├── orders.module.ts
│   │   └── orders.service.spec.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts       # Cliente Prisma
│   ├── auth/
│   ├── users/
│   └── health.controller.ts
├── prisma/
│   ├── schema.prisma               # Schema dos modelos
│   ├── seed.ts                     # Dados iniciais
│   └── migrations/
├── test/
│   └── jest-e2e.json
└── package.json
```

### Arquitetura em Camadas

```
HTTP Request
    ↓
┌─ Controller ─┐
│ (endpoints)  │
└──────┬───────┘
       ↓
┌─ Service ────┐
│ (lógica)     │ ← Testes unitários
└──────┬───────┘
       ↓
┌─ Prisma ─────┐
│ (banco)       │
└──────┬───────┘
       ↓
  PostgreSQL
```

### Fluxo de Criar Pedido

1. **POST** `/api/orders` com JSON:
```json
{ "items": [{ "productId": 1, "quantity": 2 }] }
```

2. **OrdersController**
   - Valida o DTO
   - Chama `ordersService.create()`

3. **OrdersService** (lógica de negócio)
   - Valida se produtos existem
   - Valida estoque suficiente
   - Cria o pedido
   - **Decrementa** o estoque dos produtos

4. **Prisma** (persistência)
   - Executa transações no banco

5. **Response** ao cliente:
```json
{
  "id": 1,
  "status": "Pendente",
  "totalPrice": 250.00,
  "items": [...]
}
```

### Validação com DTOs

**Exemplo - CreateProductDto**:
```typescript
class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}
```

**Pipes do NestJS**:
- `class-validator` + `class-transformer`
- Validação automática em todos os endpoints

### Tratamento de Erros

```typescript
// Produto não encontrado
throw new NotFoundException(`Produto ${id} não encontrado`);

// Dados inválidos
throw new BadRequestException(`Estoque insuficiente`);

// Erro genérico
throw new InternalServerErrorException();
```

## 🗄️ Banco de Dados

### Schema Prisma

```prisma
model Product {
  id              Int
  name            String
  category        String
  price           Decimal
  stockQuantity   Int
  orderItems      OrderItem[]
}

model Order {
  id        Int
  status    String        // "Pendente", "Concluído", "Cancelado"
  totalPrice Decimal
  items     OrderItem[]
}

model OrderItem {
  orderId   Int
  productId Int
  quantity  Int
  product   Product
  order     Order
}
```

### Migrations

Ao alterar o schema, execute:
```bash
npm run prisma:migrate
```

Isso gera um arquivo SQL em `prisma/migrations/`

## 🧪 Testes

### Frontend (Jest + React Testing Library)

**Arquivos**:
- `__tests__/product-card.snapshot.test.tsx`
- `__tests__/product-filters.test.tsx`

**Exemplos**:
```typescript
describe('ProductCard', () => {
  it('should match snapshot', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    expect(container).toMatchSnapshot();
  });

  it('should show out of stock badge', () => {
    render(<ProductCard product={{ ...mockProduct, stockQuantity: 0 }} />);
    expect(screen.getByText('Fora de estoque')).toBeInTheDocument();
  });
});
```

### Backend (Jest)

**Arquivos**:
- `src/products/products.service.spec.ts`
- `src/orders/orders.service.spec.ts`

**Exemplo**:
```typescript
describe('ProductsService', () => {
  it('should create a product', async () => {
    const result = await service.create(createProductDto);
    expect(result.id).toBeDefined();
    expect(prisma.product.create).toHaveBeenCalled();
  });
});
```

## 🚀 Performance & Otimizações

### Frontend
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Lazy loading de rotas
- **Caching**: React Query com staleTime
- **Memoization**: React.memo para componentes caros

### Backend
- **Database Indexes**: category, price, name em Products
- **Query Optimization**: Select específico de campos
- **Pagination**: limit/offset para listas grandes
- **Connection Pooling**: Prisma com pool automático

## 🔒 Segurança

- **Input Validation**: Zod (frontend) + class-validator (backend)
- **CORS**: Configurado apenas para origin local
- **SQL Injection**: Proteção automática do Prisma
- **Type Safety**: TypeScript end-to-end

## 📝 Convenções de Código

### Naming
- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- DTOs: `*.dto.ts`
- Testes: `*.spec.ts`

### Estrutura de Pastas
- Agrupar por feature, não por tipo
- Um módulo = um recurso

### Commits
```
feat(products): add filter by price range
fix(orders): correct stock decrement logic
docs: update README with setup instructions
```

## 🐳 Docker

```yaml
services:
  postgres:
    image: postgres:15
    ports: ["55432:5432"]
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: thera_db

  backend:
    build: ./backend
    ports: ["3001:3001"]
    depends_on: [postgres]

  frontend:
    build: ./frontend
    ports: ["3005:3000"]
    depends_on: [backend]
```

## 📚 Stack Details

| Camada | Tecnologia | Versão | Propósito |
|--------|-----------|--------|----------|
| Frontend Framework | Next.js | 15 | SSR, routing, API |
| ORM Frontend | Drizzle | 0.41 | Type-safe queries |
| API Communication | tRPC | 11 | RPC type-safe |
| Styling | TailwindCSS | 3.4 | Utility-first CSS |
| Forms | React Hook Form | 7.71 | State management |
| Validation | Zod | 3.25 | Schema validation |
| Backend Framework | NestJS | 10 | Modular architecture |
| ORM Backend | Prisma | 5.7 | Schema + migrations |
| Database | PostgreSQL | 15 | Relational DB |
| API Docs | Swagger | 7.4 | OpenAPI docs |
| Testing | Jest | 29 | Unit tests |
| UI Components | Radix UI | 1.x | Accessible components |

## 🔄 Fluxo Completo de Operação

### 1. Criar Produto (Frontend)
```
User → ProductFormDialog → onSubmit
       → api.products.create.mutate()
       → tRPC → Backend ProductsController
       → ProductsService.create()
       → Prisma.product.create()
       → Response → Frontend update list
```

### 2. Listar Produtos (Frontend)
```
Dashboard monta → api.products.list.useQuery(filters)
                → tRPC → Backend ProductsController
                → ProductsService.findAll(filters)
                → Prisma + WHERE clauses
                → Response com paginação
                → Renderiza ProductCard
```

### 3. Criar Pedido (Backend)
```
POST /api/orders → OrdersController
                 → Validação DTO
                 → OrdersService.create()
                 → Loop: validar cada produto
                 → Calcular total
                 → Prisma.order.create()
                 → Prisma.product.update() (stock)
                 → Response com pedido criado
```

## 🎓 Conceitos Aprendidos

- ✅ Arquitetura limpa (separação de responsabilidades)
- ✅ Type-safety end-to-end (TypeScript)
- ✅ Validação em camadas (DTOs + Zod)
- ✅ ORM com type-safety (Prisma + Drizzle)
- ✅ API type-safe com tRPC
- ✅ Testes unitários e de snapshot
- ✅ Documentação automática (Swagger)
- ✅ Docker para ambiente reproduzível
