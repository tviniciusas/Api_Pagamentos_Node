# Payment API

API REST para gerenciamento de pagamentos com integração PIX e Cartão de Crédito via Mercado Pago.

## Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
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
│   └── services/     # Serviços externos (Mercado Pago)
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

## Instalação

### Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- Docker (opcional)

### Configuração

1. Clone o repositório:
```bash
git clone <repository-url>
cd payment-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o banco de dados (com Docker):
```bash
docker-compose up -d postgres
```

5. Execute a aplicação:
```bash
npm run start:dev
```

### Com Docker

```bash
docker-compose up -d
```

## Testes

```bash
# Testes unitários
npm test

# Testes com cobertura
npm run test:cov

# Testes em modo watch
npm run test:watch
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
