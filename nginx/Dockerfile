
# Imagen oficial mínima de Nginx (~5MB)
FROM nginx:1.25-alpine
 
# Elimina la config por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf
 
# La config real y el frontend se montan como volúmenes
# en docker-compose.yml, no se copian aquí
# (facilita cambios sin reconstruir la imagen)
 
EXPOSE 80
 