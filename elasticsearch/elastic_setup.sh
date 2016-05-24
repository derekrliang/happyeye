#!/bin/bash

#
# Delete happymeter index (if exists)
#
#curl -XDELETE 'http://localhost:9200/happymeter' 

#
# Define main index - happymeter
#
curl -XPOST localhost:9200/happymeter -d '{
    "settings" : {
        "number_of_shards" : 1
    },
    "mappings" : {
        "happymeter" : {
            "properties" : {
                happystatus: { type: "string", index: "not_analyzed" },
                timestamp: {type: "date"},
                tags: {type: "string", index: "not_analyzed"}
            }
       }
    }
}'

#
# Create a snapshot backups (named happy_backup)
#
curl -XPUT 'http://localhost:9200/_snapshot/happy_backup' -d '{
    "type": "fs",
    "settings": {
        "location": "backup",
        "compress": true
    }
}'

