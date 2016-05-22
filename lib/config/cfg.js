var mysql = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '1234qwer',
	database: 'test'
}
exports.mysqlcfg = mysql;

var bq = {
	projectId: 'mitac-cp300',
	dataset: 'test',
	'json_file': '/Users/peihsinsu/.gcpkeys/mitac-cp300/mitac-cp300-e75b19c172ba.json'
}
exports.bq = bq;
