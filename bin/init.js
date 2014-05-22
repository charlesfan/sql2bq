var fs = require('fs')
var confset = require('../lib/tool').createConf
	,	key = ["projectID",
					"dataset",
					"client_secret",
					"privatekey_pem",
					"key_pem",
					"ipAddress",
					"port",
					"dbAccount",
					"dbpwd",
					"dbName"]
	, init = {};

key.reverse();

function ask(question, format, fn){
	var stdin = process.stdin
		, stdout = process.stdout;

	if(typeof(format) === 'function') var fn = format;
	stdin.resume();
	stdout.write(question.pop() + ': ');

	stdin.setEncoding('utf-8');	
	stdin.once('data', function(data){
		data = data.toString().trim();
		init[key.pop()] = data;
		if(question.length > 0) ask(question, format, fn);
		else fn(init);
	});
}

exports.main = main;
function main(){
	var question = [
		"Your project ID",
		"The name of BigQuery dataset",
		"The PATH of client_secret",
		"The PATH of privatekey_pem",
		"The PATH of key_pem",
		"Local DB\' IP address",
		"Local DB\' port",
		"DB User",
		"DB password",
		"Database name"
	]

	question.reverse();
	ask(question, function(data){
		var tmpFile = __dirname + '/../lib/config-example/cfg.js'
			,	finFile = __dirname + '/../lib/config/cfg.js';
	
		fs.readFile(tmpFile, 'utf8', function(err, file){
			var _config = confset(data, file);
			console.log('User\'s input: ',data);
			fs.writeFile(finFile, _config, function(err){
				if(err)console.log('[Write cfg.js ERROR]',err);
				process.exit();
			});
		});	
	});
}

main();
