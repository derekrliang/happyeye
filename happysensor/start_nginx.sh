#!/bin/bash

if [ -z "${HAPPYSERVERURL}" ]; then
    echo "Missing HAPPYSERVERURL"
    nginx -g 'daemon off;'
else
    sed -i 's/localhost/'"$HAPPYSERVERURL"'/g' /usr/share/nginx/html/index.html
    nginx -g 'daemon off;'
fi
