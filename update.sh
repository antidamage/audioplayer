#!/bin/bash
set -euo pipefail

git pull --rebase
npm ci --include=dev
rm -rf .next
npm run build
npm prune --omit=dev
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
