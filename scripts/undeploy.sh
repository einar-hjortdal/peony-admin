# /bin/bash

# Does not remove containers, images nor volumes.
# Run `docker system prune --volumes --all` manually if needed.
# sudo docker volume rm peony-admin-build
stopContainers() {
  docker rm \
    peony-admin-app \
    peony-admin-freenginx
}

removeCronJob() {
  currentCrontab=$(crontab -l 2>/dev/null)
  
  # Check if the job is in the crontab
  if echo "$currentCrontab" | grep -Fq "$1"; then
    # Remove the job from the crontab
    echo "$currentCrontab" | grep -Fv "$1" | crontab -
  fi
}

removeStartupJobs() {
  removeCronJob "@reboot docker start peony-admin-app"
  removeCronJob "@reboot docker start peony-admin-freenginx"
}


main() {
  [ "$UID" -eq 0 ] || exec sudo bash "$0" "$@"
  stopContainers
  removeStartupJobs
}

main