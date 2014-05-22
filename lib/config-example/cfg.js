var mysql = {
	host: '$ipAddress',
	port: $port,
	user: '$dbAccount',
	password: '$dbpwd',
	database: '$dbName'
}
exports.mysqlcfg = mysql;

var bq = {
	scope: 'https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/cloud-platform',
	client_secret: '$client_secret',
	privatekey_pem: '$privatekey_pem',
	key_pem: '$key_pem',
	projectId: '$projectID',
	dataset: '$dataset'
}
exports.bq = bq;
