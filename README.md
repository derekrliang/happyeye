# happyeye
A simple happymeeter solution which should capture information about employee happiness from various perspectives

Work has just started - we will evolve with the demand :)

General architecture
* Happiness submitters frontend: Anything that can post a form/JSON to a web service. We provide a static html file/interface
* Middleware: A web service accepting request storing these into a elasticsearch database
* Happiness reviewers frontend: Kibana
* Happiness storage: Elasticsearch

Document format
* {happystatus: 'average'|'below'|'above'}  

Deployment
* Alter and then source 'local_env'
* docker-compose start
* execute "elasticsearch/elastic_setup.sh" to create index and mapping

#### middleware: happyeyeserver ####

A server component that accepts post to a given url and store meeter documents in an elaticsearch database

* 'npm install' to initialise
* 'grunt' for development with linting, watch, server reload ...
