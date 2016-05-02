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
function addDocument(happystatus,tags) {  
    return elasticClient.index({
        index: indexName,
        type: "happymeter",
        body: {
            happystatus: happystatus,
            timestamp: Date.now(),
            tags: tags
        }
    });
}
exports.addDocument = addDocument;

