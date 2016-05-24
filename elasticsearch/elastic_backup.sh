#!/bin/bash

#
# A very simple snapshot/backup script for the elastic node
# (We assume the Elastic repo and snapshot exists)
#
# Remember to customize the vars to your set-up and add-your-thing for where to transport/store the backups
# This script should be executed from cron

SNAPSTAMP=$(date +"%Y%m%d%H%M")
SNAPNAME="/tmp/"$SNAPSTAMP"_happy_meter_backup.tar.gz"
ELASTICBACKUP="/data/backup"

curl -XPUT localhost:9200/_snapshot/happy_backup/snapshot_$SNAPSTAMP?wait_for_completion=true
tar -vzcvf $SNAPNAME $ELASTICBACKUP

#cp $SNAPNAME ~/backups