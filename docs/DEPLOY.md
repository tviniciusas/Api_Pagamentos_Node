# CI/CD e Deploy

Todo push na branch `main` gera um deploy automático. Pull requests e outras branches rodam apenas a
validação (lint, testes, build e build da imagem Docker).

## Visão geral

```
push main ──▶ [test] lint + jest + build
                 │
                 ▼
              [image] docker build ──▶ push ghcr.io/<owner>/api_pagamentos_node:sha-xxxx (+ latest)
                 │
                 ▼
              [deploy] (runner self-hosted no servidor)
                 ├─ copia docker-compose.prod.yml, temporal-config → /opt/payment-api
                 ├─ docker compose pull
                 ├─ roda migrations (container one-shot `migrate`)
                 ├─ sobe api + temporal-worker
                 ├─ smoke test em http://127.0.0.1:3000/health
                 └─ rollback automático para a imagem anterior se o health check falhar
```

Workflows:

| Arquivo | Gatilho | O que faz |
|---------|---------|-----------|
| `.github/workflows/ci.yml` | PR para `main`, push em outras branches | lint, testes com cobertura, build, build da imagem (sem push) |
| `.github/workflows/deploy.yml` | push em `main`, manual (`workflow_dispatch`) | tudo acima + push da imagem no GHCR + deploy no servidor |

## Por que runner self-hosted?

O servidor está numa rede local (IP privado) e expõe para a internet apenas as portas 80 e 443.
Um runner self-hosted rodando no próprio servidor faz a conexão de saída para o GitHub, então não é
preciso abrir SSH para fora nem guardar senha do servidor em secrets.

## Configuração inicial do servidor (uma vez)

1. Conecte no servidor e rode o bootstrap:

   ```bash
   curl -fsSL https://raw.githubusercontent.com/tviniciusas/Api_Pagamentos_Node/main/scripts/setup-server.sh | bash
   ```

   Ele instala o Docker (se faltar), cria `/opt/payment-api` e gera `/opt/payment-api/.env` a partir
   de `.env.production.example`.

2. Edite `/opt/payment-api/.env`. Campos obrigatórios:

   | Variável | Descrição |
   |----------|-----------|
   | `DB_PASSWORD` | Senha do Postgres interno da stack (a porta 5432 não é publicada no host, então não conflita com o Postgres já existente). |
   | `MERCADO_PAGO_ACCESS_TOKEN` | Token do Mercado Pago. |
   | `APP_URL` / `MERCADO_PAGO_WEBHOOK_URL` | URL pública da API, ex.: `https://api.seudominio.com`. |

3. Registre o runner self-hosted em
   `https://github.com/tviniciusas/Api_Pagamentos_Node/settings/actions/runners/new`
   (Linux x64). Use exatamente estes parâmetros no `config.sh`:

   ```bash
   ./config.sh --url https://github.com/tviniciusas/Api_Pagamentos_Node --token <TOKEN> \
               --name payment-server --labels payment-server --unattended
   sudo ./svc.sh install && sudo ./svc.sh start
   ```

   O label `payment-server` é o que o job `deploy` usa em `runs-on`.

4. No GitHub, em *Settings → Environments*, crie o environment `production` (opcional: exija
   aprovação manual antes do deploy). A variável `APP_PUBLIC_URL` aparece como link no run.

5. Faça o pacote GHCR acessível ao runner: após o primeiro push da imagem, em
   *Packages → api_pagamentos_node → Package settings*, confirme que o repositório tem acesso
   (o login usa o `GITHUB_TOKEN` do workflow, com permissão `packages: read`).

6. Proxy reverso: o nginx do host publica a API. Instale `deploy/nginx-payment-api.conf` em
   `/etc/nginx/sites-available/payment-api`, ative com symlink em `sites-enabled`, e emita o
   certificado com `sudo certbot --nginx -d pagamentos.168.228.189.196.nip.io`.
   A API escuta só em `127.0.0.1:3000` e a Temporal UI em `127.0.0.1:8088`.

Pronto. Faça um push em `main` e acompanhe em *Actions → Deploy*.

## Rotina

- **Deploy manual de um commit já publicado:**

  ```bash
  cd /opt/payment-api
  IMAGE_TAG=sha-abc123def456 ./deploy.sh
  ```

- **Rollback:** o mesmo comando acima com a tag anterior (as tags ficam em *Packages* no GitHub).
  O deploy também faz rollback sozinho se o health check falhar.

- **Logs:**

  ```bash
  cd /opt/payment-api
  docker compose -f docker-compose.prod.yml logs -f api temporal-worker
  ```

- **Migrations:** são aplicadas automaticamente a cada deploy pelo serviço `migrate`. Para criar uma
  nova migration em desenvolvimento:

  ```bash
  npm run migration:generate -- src/infrastructure/database/migrations/NomeDaMudanca
  ```

- **Temporal UI:** `https://pagamentos.168.228.189.196.nip.io/temporal/`.
- **URL pública:** `https://pagamentos.168.228.189.196.nip.io` (hostname wildcard nip.io apontando para o IPv4 do servidor).

## Endpoints úteis

| Endpoint | Uso |
|----------|-----|
| `GET /health` | Health check usado pelo Docker e pelo smoke test do deploy. Retorna `version` com a tag da imagem. |
