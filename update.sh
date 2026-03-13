#!/bin/bash
set -euo pipefail

git pull --rebase
npm ci --include=dev
npm run build

if pm2 describe audioplayer >/dev/null 2>&1; then
  pm2 restart audioplayer --update-env
else
  pm2 start npm --name audioplayer --cwd "$(pwd)" -- start
fi

pm2 save
