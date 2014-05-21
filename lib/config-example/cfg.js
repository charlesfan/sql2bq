var mysql = {
	host: '<DB Address>',
	port: 3306,
	user: '<user account>',
	password: '<user password>',
	database: '<database name>'
}
exports.mysqlcfg = mysql;

var bq = {
	scope: 'https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/cloud-platform',
	client_secret: '<The path of your client_secret>',
	privatekey_pem: '<The path of your privatekey_pem>',
	key_pem: '<The path of your key_pem>',
	projectId: '<Your project ID>',
	dataset: 'The name of your BQ dataset'
}
exports.bq = bq;
