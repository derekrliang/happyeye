var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({  
    host: (process.env.ELASTICURL || 'localhost:9200'),
    log: 'info'
});

var indexName = "happymeter";

/* check if the index exists */
function indexExists() {  
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;  

/* Add new document to index */
function addDocument(document) { 
    return elasticClient.index({
        index: indexName,
        type: "happymeter",
        body: document
    });
}
exports.addDocument = addDocument;

/* Add new sesnor document to datalake index */
function addSensorDocument(document) { 
    return elasticClient.index({
        index: "datalake",
        type: "datalake",
        body: document
    });
}
exports.addSensorDocument = addSensorDocument;

/* List top 10 tags */
function listTop10Tags(callback) {
    var tagsListArray=[];

    elasticClient.search({
        index: "happymeter",
        body: {
            "aggs": {
                "aggs": {
                    "terms": {
                        "field": "tags",
                        "size": 10,
                        "min_doc_count": 2
                    }
                }
            }
        }
    }).then(function (body) {
      
        tagsListArray = body.aggregations.aggs.buckets;
        console.log("listTop10Tags: " + JSON.stringify(tagsListArray));
        
        callback(tagsListArray);

    }, function (error) {
        console.trace("listTop10Tags: " + error.message);
        callback(tagsListArray);
    });
}
exports.listTop10Tags = listTop10Tags;

