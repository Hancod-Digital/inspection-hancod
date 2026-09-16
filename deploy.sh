#!/usr/bin/env bash

set -Eeuo pipefail

readonly VERCEL_PROD_PROJECT="inspection-hancod"
readonly VERCEL_SCOPE="hancods-projects-c95d7587"
readonly GIT_BRANCH="main"
readonly COMMIT_MESSAGE="fix: latest fix"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
DEPLOY_DIR="$(mktemp -d "${TMPDIR:-/tmp}/vercel-deploy-XXXXXX")"

cleanup() {
  rm -rf -- "$DEPLOY_DIR"
}
trap cleanup EXIT

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

for command_name in rsync vercel git; do
  command -v "$command_name" >/dev/null 2>&1 || fail "Required command not found: $command_name"
done

current_branch="$(git -C "$SOURCE_DIR" branch --show-current)"
[[ "$current_branch" == "$GIT_BRANCH" ]] || \
  fail "Run this script from the $GIT_BRANCH branch (currently on '$current_branch')."

printf 'Creating temporary deployment copy...\nSource: %s\nTemp: %s\n' "$SOURCE_DIR" "$DEPLOY_DIR"
rsync -a \
  --exclude='/.git/' \
  --exclude='/.next/' \
  --exclude='/.vercel/' \
  --exclude='/node_modules/' \
  --exclude='/.pnpm-store/' \
  --exclude='/out/' \
  --exclude='/dist/' \
  --exclude='/build/' \
  --exclude='/coverage/' \
  --exclude='/.turbo/' \
  --exclude='/.vscode/' \
  --exclude='**/.env' \
  --exclude='**/.env.*' \
  --exclude='**/*.env' \
  --exclude='**/.local' \
  --exclude='**/*.tsbuildinfo' \
  --exclude='**/npm-debug.log*' \
  --exclude='**/yarn-debug.log*' \
  --exclude='**/yarn-error.log*' \
  --exclude='**/pnpm-debug.log*' \
  --exclude='**/dev-server.err.log' \
  --exclude='**/dev-server.out.log' \
  -- "$SOURCE_DIR/" "$DEPLOY_DIR/"

printf 'Linking temporary directory to Vercel project: %s\n' "$VERCEL_PROD_PROJECT"
(
  cd "$DEPLOY_DIR"
  vercel link --yes --project "$VERCEL_PROD_PROJECT" --scope "$VERCEL_SCOPE"

  printf 'Deploying production build...\n'
  vercel deploy --prod --scope "$VERCEL_SCOPE"
)

printf 'Updating %s from origin...\n' "$GIT_BRANCH"
git -C "$SOURCE_DIR" pull --rebase --autostash origin "$GIT_BRANCH"
git -C "$SOURCE_DIR" add -A

if git -C "$SOURCE_DIR" diff --cached --quiet; then
  printf 'No changes to commit.\n'
else
  git -C "$SOURCE_DIR" commit -m "$COMMIT_MESSAGE"
fi

git -C "$SOURCE_DIR" push origin "$GIT_BRANCH"
printf 'Deployment and Git sync completed.\n'
