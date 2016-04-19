var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({  
    host: (process.env.ELASTICURL || 'localhost:9200'),
    log: 'info'
});

var indexName = "happymeeter";

/* Delete index */
function deleteIndex() {  
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/* create the index */
function initIndex() {  
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/* check if the index exists */
function indexExists() {  
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;  

/* Create index with mapping */
function initMapping() {  
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "happymeeter",
        body: {
            properties: {
                happystatus: { type: "string" },
                timestamp: { type: "date"}
            }
        }
    });
}
exports.initMapping = initMapping;

/* Add new document to index */
function addDocument(happystatus) {  
    return elasticClient.index({
        index: indexName,
        type: "happymeeter",
        body: {
            happystatus: happystatus,
            timestamp: Date.now()
        }
    });
}
exports.addDocument = addDocument;

