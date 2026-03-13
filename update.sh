#!/bin/bash
set -euo pipefail

git pull --rebase
npm ci --include=dev
npm run build
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
