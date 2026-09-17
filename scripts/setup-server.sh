#!/usr/bin/env bash
# One-time server bootstrap (Ubuntu/Debian). Run as a user with sudo:
#
#   curl -fsSL https://raw.githubusercontent.com/tviniciusas/Api_Pagamentos_Node/main/scripts/setup-server.sh | bash
#
# It installs Docker (if missing), creates /opt/payment-api and prints the next steps
# for registering the GitHub Actions self-hosted runner.
set -Eeuo pipefail

DEPLOY_DIR=/opt/payment-api
REPO_URL="https://github.com/tviniciusas/Api_Pagamentos_Node"

echo "==> Installing Docker (if needed)"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sudo sh
fi
sudo usermod -aG docker "$USER" || true
docker compose version >/dev/null 2>&1 || { echo "docker compose plugin missing"; exit 1; }

echo "==> Creating ${DEPLOY_DIR}"
sudo mkdir -p "$DEPLOY_DIR/temporal-config"
sudo chown -R "$USER":"$USER" "$DEPLOY_DIR"

if [ ! -f "$DEPLOY_DIR/.env" ]; then
  curl -fsSL "${REPO_URL}/raw/main/.env.production.example" -o "$DEPLOY_DIR/.env"
  chmod 600 "$DEPLOY_DIR/.env"
  echo "==> Created ${DEPLOY_DIR}/.env from template. EDIT IT before the first deploy."
fi

cat <<EOF

==============================================================
Next steps
==============================================================
1. Edit ${DEPLOY_DIR}/.env (DOMAIN, DB_PASSWORD, MERCADO_PAGO_ACCESS_TOKEN, APP_URL ...)

2. Register the GitHub Actions self-hosted runner on this machine:
   ${REPO_URL}/settings/actions/runners/new
   - Choose Linux x64 and follow the download steps shown there, then:
       ./config.sh --url ${REPO_URL} --token <TOKEN> \\
                   --name payment-server --labels payment-server --unattended
       sudo ./svc.sh install && sudo ./svc.sh start
   - The label "payment-server" is what .github/workflows/deploy.yml targets.

3. Log out and back in (docker group), then push to main. The pipeline will
   build the image, publish it to GHCR and deploy it here.
==============================================================
EOF
