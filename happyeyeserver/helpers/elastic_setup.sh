#!/bin/bash

curl -XDELETE 'http://localhost:9200/happymeeter' 
curl -XPOST localhost:9200/happymeeter -d '{
    "settings" : {
        "number_of_shards" : 1
    },
    "mappings" : {
        "happymeeter" : {
            "properties" : {
                happystatus: { type: "string" },
                timestamp: { type: "date"}   
            }
        }
    }
}'

