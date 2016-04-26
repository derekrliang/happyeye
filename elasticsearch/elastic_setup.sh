#!/bin/bash

#curl -XDELETE 'http://localhost:9200/happymeter' 
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

