#!/bin/bash
cd "$(dirname "$0")"

# ssh escaperoom "mkdir -p ~/bhumi/log"
pnpm build
scp -r dist escaperoom:~/bhumi/.
# scp -r nginx_bhumi.conf escaperoom:~/bhumi/.
