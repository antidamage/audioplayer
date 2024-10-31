#!/bin/bash          
git pull             
npm run build        
pm2 stop audioplayer 
pm2 start audioplayer