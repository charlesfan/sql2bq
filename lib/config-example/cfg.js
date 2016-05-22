var mysql = {
	host: '$ipAddress',
	port: $port,
	user: '$dbAccount',
	password: '$dbpwd',
	database: '$dbName'
}
exports.mysqlcfg = mysql;

var bq = {
	projectId: '$projectID',
	dataset: '$dataset',
	'json_file': '$json_file'
}
exports.bq = bq;
