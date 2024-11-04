#!/bin/bash
git pull --rebase
git rebase --continue
npm run build
pm2 stop audioplayer
pm2 start audioplayer