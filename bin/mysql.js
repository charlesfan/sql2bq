#!/usr/bin/env node
var p = require('commander')
	, db = require('../lib/mysql-config').mysqldb
	, lazy = require("lazy")
	, fs  = require("fs")
	, _ = require('underscore')
	, parser = require('../lib/tool').jsonParser
	, bq = require('../lib/bq');


p.version('0.0.1')
	.option('-p, --project <project>', 'Specify the BigQuery project')
	.option('-d, --dataset <dsname>', 'Specify the dataset name')
	.option('-q, --query <command>', 'Specify the sql command you want input')
	.option('-t, --table <tablename>', 'Specify the table name')
	.option('-w, --tofile', 'Is write to file instand of insert BigQuery')
	.option('-b, --buffer <buffer_size>', 'The streaming insert buffer size')
	.parse(process.argv);

var prjId = p.project  
	, dsName = p.dataset 
	, TO_FILE = p.tofile
	, query = p.query
	, tableName = p.table
	, buffer_size = p.buffer | 1000;

//if(!prjId || !dsName || !filename) {
if(!query) {
	console.log('[Error] parameter sql query\(-q\) not specify');
	process.exit(1);
}

if(!tableName) {
	console.log('[Error] parameter table name\(-t\) not specify');
	process.exit(1);
}

exports.sqlQuery = sqlQuery;
function sqlQuery() {
	var bqtype = require("../lib/type")
		,	schema = [];

	console.log('Start query DB: [SQL] %s',query);
	db.query(query, function(err, rows, fiels){
		if(err){
			console.log('[Error] Query Error: %s',JSON.stringify(err));
			process.exit(1);
		}
		bq.getBqTable(tableName, prjId, dsName, function(r){
			var result = JSON.parse(r);
			if(result.error && result.error.code == 404){
				console.log('Table: %s does not exist',tableName);
				bq.createBqTable(fiels, tableName, prjId, dsName, function(r){
					if(r.creationTime) bq.insertBqData(rows, tableName, prjId, dsName);
				});
			}else{
				bq.insertBqData(rows, tableName, prjId, dsName);
			}
		});
	});
	db.end();
}

sqlQuery();
