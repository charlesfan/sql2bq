sql2bq
---

Query data from SQL DB and dump data into bigquery.

### Install

```
git clone https://github.com/charlesfan/sql2bq.git
cd sql2bq && npm install
```

### Create Config File

We need google client_secret, privatekey_pem and key_pem in config file let this apk to connect your bq. If you don't have google client_secret, privatekey_pem or key_pem, follow the doc: http://gappsnews.blogspot.tw/2013/10/connect-cloud-platform-bigquery-using.html before you create init file. Then you can copy the config example file at sql2bq/lib/config-example:
```
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
```
Put your parament of your local SQL server and google project into this file, then save as: sql2bq/lib/config/cfg.js. Or you can use sql2bq/bin/init.js to create config folder and file:
```
node bin/init.js
```
Check your config file and start use this apk.

### Query Operation

```
-p, --project <project>, Specify the BigQuery project

-d, --dataset <dsname>, Specify the dataset name

-q, --query <command>, Specify the sql command you want input(require)

-t, --table <tablename>, Specify the table name(require)
```

### Do Query

You can just use sql command to query your data from SQL DB and upload to your bq.
```
node bin/mysql.js -q 'select * from <db_table>' -t <bq_name>
```
