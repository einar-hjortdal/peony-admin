# /bin/bash

buildImages() {
  docker build \
    --tag peony-admin-freenginx \
    --build-arg=CONFIG=deploy/freenginx/freenginx.conf \
    --file deploy/freenginx/Containerfile .
}

startContainersNow() {
  docker run \
    --detach \
    --replace \
    --name peony-admin-freenginx \
    --env=PORT=12000 \
    --publish=12000:12000 \
    --volume=peony-admin-build:/srv/build:z \
    --restart=unless-stopped \
    localhost/peony-admin-freenginx
}

# addCronJob adds a line to crontab if it is not in it already
addCronJob() {
  currentCrontab=$(crontab -l 2>/dev/null)
  
  # Check if the job is already in the crontab
  if ! echo "$currentCrontab" | grep -Fq "$1"; then
    # Add the job to the crontab
    (echo "$currentCrontab"; echo "$1") | crontab -
  fi
}

startContainersAtStartup() {
  addCronJob "@reboot docker start peony-admin-freenginx" 
}

main() {
  [ "$UID" -eq 0 ] || exec sudo bash "$0" "$@"
  buildImages
  startContainersNow
  startContainersAtStartup
}

main
