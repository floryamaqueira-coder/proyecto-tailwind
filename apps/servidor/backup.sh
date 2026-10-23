#!/bin/bash
# Uso: backup.sh completo | incremental
DIR_PROYECTO=/opt/vyse
DESTINO=/var/backups/vyse
FECHA=$(date +%F)
source $DIR_PROYECTO/.env
mkdir -p $DESTINO/completo $DESTINO/incremental

if [ "$1" = "completo" ]; then
  docker exec -e MYSQL_PWD="$DB_ROOT_PASS" vyse-db \
    mysqldump -uroot --single-transaction --flush-logs --all-databases \
    | gzip > $DESTINO/completo/bd_$FECHA.sql.gz
  tar czf $DESTINO/completo/web_$FECHA.tar.gz -C $DIR_PROYECTO .
  # Copia externa semanal (completar destino):
  # rsync -a $DESTINO/completo/ usuario@servidor-externo:/respaldos/vyse/
else
  docker exec -e MYSQL_PWD="$DB_ROOT_PASS" vyse-db mysqladmin -uroot flush-logs
  # Copiar los binlogs ya cerrados (todos menos el activo)
  for f in $(docker exec vyse-db sh -c 'ls /var/lib/mysql | grep -E "^binlog\.[0-9]+$"' | head -n -1); do
    [ -f "$DESTINO/incremental/$f" ] || docker cp vyse-db:/var/lib/mysql/$f $DESTINO/incremental/$f
  done
fi

find $DESTINO -type f -mtime +30 -delete