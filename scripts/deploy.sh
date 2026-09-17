#!/usr/bin/env bash
# Deploys the stack on the server. Executed by the GitHub Actions self-hosted runner
# from /opt/payment-api, but can also be run by hand:
#
#   IMAGE_TAG=sha-abc123 ./deploy.sh
#
# Steps: pull image -> run migrations -> rolling restart of api/worker -> smoke test -> prune.
# On failure it rolls back to the previously running image tag.
set -Eeuo pipefail

COMPOSE="docker compose -f docker-compose.prod.yml --env-file .env"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/health}"
HEALTH_RETRIES="${HEALTH_RETRIES:-30}"

log() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

[ -f .env ] || fail ".env not found in $(pwd). Create it from .env.production.example"
[ -n "${IMAGE_TAG:-}" ] || fail "IMAGE_TAG is required (e.g. sha-abc123 or latest)"

# Persist the tag we are deploying into .env so `docker compose up` on the host
# (without env vars) keeps using it, and remember the previous one for rollback.
PREVIOUS_TAG="$(grep -E '^IMAGE_TAG=' .env | cut -d= -f2- || true)"
export IMAGE IMAGE_TAG
sed -i.bak -E "/^IMAGE_TAG=/d" .env && rm -f .env.bak
echo "IMAGE_TAG=${IMAGE_TAG}" >> .env
if [ -n "${IMAGE:-}" ]; then
  sed -i.bak -E "/^IMAGE=/d" .env && rm -f .env.bak
  echo "IMAGE=${IMAGE}" >> .env
fi

rollback() {
  if [ -n "$PREVIOUS_TAG" ] && [ "$PREVIOUS_TAG" != "$IMAGE_TAG" ]; then
    log "Rolling back to ${PREVIOUS_TAG}"
    sed -i.bak -E "/^IMAGE_TAG=/d" .env && rm -f .env.bak
    echo "IMAGE_TAG=${PREVIOUS_TAG}" >> .env
    IMAGE_TAG="$PREVIOUS_TAG" $COMPOSE up -d --no-deps --remove-orphans api temporal-worker || true
  fi
}

log "Deploying ${IMAGE:-<image from .env>}:${IMAGE_TAG} (previous: ${PREVIOUS_TAG:-none})"

log "Validating compose file"
$COMPOSE config -q

log "Pulling images"
$COMPOSE pull --quiet

log "Starting infrastructure (postgres, temporal)"
$COMPOSE up -d postgres temporal temporal-ui

log "Running database migrations"
if ! $COMPOSE run --rm --no-deps migrate; then
  fail "Migrations failed; app containers were not touched."
fi

log "Starting application containers"
trap rollback ERR
$COMPOSE up -d --no-deps --remove-orphans api temporal-worker

log "Waiting for health check at ${HEALTH_URL}"
for i in $(seq 1 "$HEALTH_RETRIES"); do
  if curl -fsS --max-time 3 "$HEALTH_URL" >/dev/null 2>&1; then
    echo "Healthy after ${i} attempt(s):"
    curl -fsS "$HEALTH_URL"; echo
    trap - ERR
    log "Cleaning up old images"
    docker image prune -f --filter "until=72h" >/dev/null || true
    log "Deploy finished successfully"
    $COMPOSE ps
    exit 0
  fi
  sleep 3
done

echo "Last 50 log lines from api:"
$COMPOSE logs --tail=50 api || true
rollback
fail "Health check failed after ${HEALTH_RETRIES} attempts"
