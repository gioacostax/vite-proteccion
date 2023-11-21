#!/bin/sh
set -eu

ENV_STR=''

list_env_var_names() {
  ALL_ENV=$(env | sed -e 's/=.*//g')
  for var in $ALL_ENV
  do
    ENV_STR="$ENV_STR"" \$""$var"
  done
}

file_envsubst() {
	route_file=$1
	file=$(find $route_file)
	cp "$file" "$file".copy
	envsubst "$ENV_STR" < "$file".copy > "$file"
	rm "$file".copy
}

list_env_var_names
file_envsubst "/etc/nginx/nginx.conf"
file_envsubst "/usr/share/nginx/html/main-*.js"
for filename in $(ls /usr/share/nginx/html/js/*.js)
do
  file_envsubst $filename
done
exec "$@"
