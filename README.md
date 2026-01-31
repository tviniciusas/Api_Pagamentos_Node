# Payment API

API REST para gerenciamento de pagamentos com integração PIX e Cartão de Crédito via Mercado Pago.

## Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Temporal.io** - Orquestração de workflows duráveis
- **Jest** - Framework de testes
- **Docker** - Containerização

## Arquitetura

O projeto segue os princípios da **Clean Architecture**:

```
src/
├── domain/           # Camada de domínio (entidades, interfaces)
│   ├── entities/     # Entidades de negócio
│   ├── enums/        # Enumerações
│   ├── repositories/ # Interfaces de repositório
│   └── services/     # Interfaces de serviços externos
├── application/      # Camada de aplicação (casos de uso)
│   ├── dtos/         # Data Transfer Objects
│   └── use-cases/    # Casos de uso
├── infrastructure/   # Camada de infraestrutura (implementações)
│   ├── database/     # Configuração e repositórios TypeORM
│   ├── services/     # Serviços externos (Mercado Pago)
│   └── temporal/     # Workflows e activities do Temporal.io
└── presentation/     # Camada de apresentação (controllers)
    ├── controllers/  # Controllers REST
    └── filters/      # Filtros de exceção
```

## Endpoints da API

### Pagamentos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/payment` | Criar novo pagamento |
| PUT | `/api/payment/:id` | Atualizar pagamento |
| GET | `/api/payment/:id` | Buscar pagamento por ID |
| GET | `/api/payment` | Listar pagamentos (com filtros) |

### Webhook

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/webhook/mercado-pago` | Receber notificações do Mercado Pago |

## Modelo de Dados

```typescript
{
  id: string;           // UUID
  cpf: string;          // 11 dígitos
  description: string;  // Descrição da cobrança
  amount: number;       // Valor da transação
  paymentMethod: 'PIX' | 'CREDIT_CARD';
  status: 'PENDING' | 'PAID' | 'FAIL';
  createdAt: Date;
  updatedAt: Date;
}
```

## Regras de Negócio

### PIX
- Cria registro com status `PENDING`
- Não requer integração externa

### Cartão de Crédito
- Integra com API de Preferências do Mercado Pago
- Retorna `initPoint` para redirecionamento ao checkout
- Recebe callback via webhook para atualizar status
- **Utiliza Temporal.io para orquestração durável do fluxo**

## Temporal.io - Orquestração de Pagamentos

O Temporal.io é utilizado para garantir durabilidade e resiliência no processamento de pagamentos com Cartão de Crédito.

### Arquitetura do Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   API NestJS    │────▶│  Temporal.io    │────▶│  Mercado Pago   │
│   (Controller)  │     │   (Workflow)    │     │     (API)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                       │
         │                      ▼                       │
         │              ┌─────────────────┐             │
         └─────────────▶│   PostgreSQL    │◀────────────┘
                        └─────────────────┘
```

### Fluxo do Workflow

1. **Usuário cria pagamento CREDIT_CARD** → API inicia workflow
2. **Workflow salva pagamento** com status `PENDING`
3. **Workflow chama Mercado Pago** → Cria preferência de checkout
4. **Workflow aguarda sinal** (até 30 minutos configurável)
5. **Webhook recebido** → Sinaliza workflow com resultado
6. **Workflow atualiza pagamento** → `PAID` ou `FAIL`
7. **Timeout** → Workflow marca como `FAIL`

### Benefícios

- **Durabilidade**: Se o servidor cair, o workflow continua de onde parou
- **Retry automático**: Activities com retry configurável
- **Visibilidade**: Interface web do Temporal (porta 8080)
- **Timeout**: Tratamento de pagamentos que nunca recebem callback

### Executando o Worker

```bash
# Desenvolvimento
pnpm start:worker

# Produção
pnpm start:worker:prod
```

### Interface do Temporal

Acesse a interface web do Temporal em: http://localhost:8080

## Instalação

### Pré-requisitos

- Node.js 20+
- pnpm 8+ (`npm install -g pnpm`)
- Docker e Docker Compose
- PostgreSQL 15+ (ou usar via Docker)

### Configuração Rápida (Desenvolvimento Local)

1. Clone o repositório:
```bash
git clone <repository-url>
cd payment-api
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie a infraestrutura (PostgreSQL + Temporal):
```bash
docker-compose up -d postgres temporal temporal-ui
```

5. Aguarde os serviços estarem prontos:
```bash
# Verificar se o Temporal está saudável
docker-compose logs -f temporal
# Aguarde a mensagem "Temporal server is ready"
```

6. Em um terminal, inicie o Worker do Temporal:
```bash
pnpm start:worker
```

7. Em outro terminal, inicie a API:
```bash
pnpm start:dev
```

### Com Docker (Todos os Serviços)

```bash
# Build e iniciar todos os serviços (API, Worker, PostgreSQL, Temporal)
docker-compose up -d --build

# Verificar status dos containers
docker-compose ps

# Verificar logs de todos os serviços
docker-compose logs -f

# Verificar logs do worker
docker-compose logs -f temporal-worker

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (reset completo)
docker-compose down -v
```

**Serviços disponíveis:**
| Serviço | URL | Descrição |
|---------|-----|-----------|
| API | http://localhost:3000 | API REST da aplicação |
| Temporal UI | http://localhost:8080 | Interface web do Temporal |
| PostgreSQL | localhost:5432 | Banco de dados |
| Temporal gRPC | localhost:7233 | Servidor Temporal |

### Comandos Úteis

```bash
# Desenvolvimento
pnpm start:dev          # Iniciar API em modo watch
pnpm start:worker       # Iniciar Worker do Temporal

# Build e Produção
pnpm build              # Compilar o projeto
pnpm start:prod         # Iniciar API em produção
pnpm start:worker:prod  # Iniciar Worker em produção

# Banco de Dados
pnpm migration:run      # Executar migrations
pnpm migration:generate # Gerar nova migration

# Qualidade de Código
pnpm lint               # Executar linter
pnpm format             # Formatar código
```

## Testes

```bash
# Testes unitários
pnpm test

# Testes com cobertura
pnpm test:cov

# Testes em modo watch
pnpm test:watch

# Testes e2e
pnpm test:e2e
```

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta da aplicação | `3000` |
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_USERNAME` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `postgres` |
| `DB_NAME` | Nome do banco | `payment_db` |
| `MERCADO_PAGO_ACCESS_TOKEN` | Token de acesso do Mercado Pago | - |
| `MERCADO_PAGO_WEBHOOK_URL` | URL do webhook | - |
| `MERCADO_PAGO_SANDBOX` | Modo sandbox | `true` |
| `TEMPORAL_ADDRESS` | Endereço do servidor Temporal | `localhost:7233` |
| `TEMPORAL_NAMESPACE` | Namespace do Temporal | `default` |
| `TEMPORAL_TASK_QUEUE` | Fila de tarefas do Temporal | `payment-queue` |
| `TEMPORAL_PAYMENT_TIMEOUT_MINUTES` | Timeout para aguardar pagamento | `30` |

## Exemplos de Requisições

### Criar Pagamento PIX

```bash
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "description": "Pagamento de teste",
    "amount": 100.00,
    "paymentMethod": "PIX"
  }'
```

### Criar Pagamento Cartão de Crédito

```bash
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "description": "Pagamento de teste",
    "amount": 100.00,
    "paymentMethod": "CREDIT_CARD"
  }'
```

### Buscar Pagamentos por CPF

```bash
curl "http://localhost:3000/api/payment?cpf=12345678901"
```

### Atualizar Status

```bash
curl -X PUT http://localhost:3000/api/payment/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PAID"
  }'
```

## Validações

- **CPF**: Deve conter exatamente 11 dígitos numéricos
- **Amount**: Deve ser um número positivo
- **Description**: Entre 3 e 255 caracteres
- **PaymentMethod**: Deve ser `PIX` ou `CREDIT_CARD`
- **Status**: Deve ser `PENDING`, `PAID` ou `FAIL`
