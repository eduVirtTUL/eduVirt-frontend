#!/bin/sh
envsubst < /eduVirt/env-config.js.template > /usr/share/nginx/html/eduVirt/env-config.js
nginx -g "daemon off;"