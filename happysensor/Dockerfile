from nginx

COPY index.html above.png below.png average.png /usr/share/nginx/html/

RUN rm /etc/nginx/nginx.conf
COPY conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
