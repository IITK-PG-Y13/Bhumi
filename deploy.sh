#!/bin/bash
ssh escaperoom "mkdir -p ~/bhumi/log"
scp -r dist escaperoom:~/bhumi/dist
scp -r nginx_bhumi.conf escaperoom:~/bhumi/.
