#!/bin/sh
# wait-for-db.sh

set -e

host="$DB_HOST"
user="$DB_USER"
password="$DB_PASS"
db="$DB_NAME"
port="$DB_PORT"

echo "Waiting for PostgreSQL to start on $host:$port..."

until PGPASSWORD=$password psql -h "$host" -U "$user" -d "$db" -p "$port" -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing command"

exec "$@" 
