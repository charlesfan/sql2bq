var p = require('commander')
	, fs = require('fs')
	,	bigquery = require('bigquery')
	, bqcfg = require('./config/cfg').bq
	,	bqtype = require("./type");

bigquery.init({
	scope: bqcfg.scope,
	client_secret: bqcfg.client_secret,
	privatekey_pem: bqcfg.privatekey_pem,
	key_pem: bqcfg.key_pem
});

exports.insertBqData = function(data, table, id, dataset){
	var prjId = id || bqcfg.projectId
		,	dsName = dataset || bqcfg.dataset
		, tableName = table
		, size =10000
		, queue = [];

	console.log('BQ project: %s',prjId);
	console.log('BQ dataset: %s',dsName);
	for(var x = 0 ; x < size ; x++) {
		if(data.length <=0 ) break;
		var jtmp = {}
		jtmp.json = data.pop();
		queue.push(jtmp);
	}
	bigquery.job.load(prjId, dsName, tableName, queue, function(e,r,d){
		console.log('[INSERT RESULT]' + JSON.stringify(d));
		/*if(d.insertErrors){
			console.log('[TEST...]', queue[0]);
		}*/
		if(e || (d['error'] && d['error']['code'] && d.error.code == 403)) {
			if(e)
				console.log('[ERROR]', e);
			else
				console.log('[ERROR]Push back the queue:%s (%s records) data....', queue, queue.length);
			for(var x = 0 ; x < queue.length ; x++) {
				data.push(queue[x]);
			}
			console.log('[ERRIR]%s total:%s', data, data.length);
		}

		if(data.length > 0) {
			console.log('Remains %s record...',data.length);
			insertBqData(data, schema, prjId, dsName);
		}
	});
}

exports.createBqTable = function(info, name, dataset, project, fn){
	if(dataset && typeof(dataset) === 'function') var fn = dataset;
	if(project && typeof(project) === 'function') var fn = project;

	var prjID = project ||  bqcfg.projectId
		, dsName = dataset || bqcfg.dataset
		, tableName = name
		, schema = [];

	info.forEach(function(value, index){
		var tmp_schema = {};
		tmp_schema.name = value.name;
		tmp_schema.type = bqtype.type[value.type];
		schema[index] = tmp_schema;
		if(index == info.length-1){
			var _schema = {};

			_schema.fields = schema;
			console.log('Schema ===> ',_schema);
			bigquery.table.create(prjID, dsName, tableName, _schema, function(e, r, d){
				if(e) console.log('[Table Created ERROR]: %s',JSON.stringify(e));
				console.log('[Table Created]: %s',JSON.stringify(d));
				fn(d);
			});
		}
	});
}

exports.getBqTable = function(name, dataset, project, fn){
	if(dataset && typeof(dataset) === 'function') var fn = dataset;
	if(project && typeof(project) === 'function') var fn = project;

	var prjID = project ||	bqcfg.projectId
		, dsName = dataset || bqcfg.dataset
		, tableName = name;

	console.log('[BQ: Get Table] Start find table: %s',tableName);
	bigquery.table.get(prjID, dsName, tableName, function(e, r, d){
		if(e) console.log('[BQ: Get Table]: %s',JSON.stringify(e));
		fn(d);
	});
}

