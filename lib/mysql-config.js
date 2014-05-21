var mysql = require('mysql')
	, cfg = require('../lib/config/cfg').mysqlcfg
	, mysql = new require('mysql')
	, db = null;

if(mysql.createConnection) {
	console.log('using createConnection, mysqlcfg: %s',JSON.stringify(cfg));
	db = mysql.createConnection(cfg);
}else{
	console.log('using mysql.Client....');
	db = new mysql.Client(cfg);
	db.connect(function(err){
		if(err){
			console.log('[Error]connect db ' + db.host + ' error: ' + err);
			process.exit();
		}
	});
}

exports.mysqldb = db;
