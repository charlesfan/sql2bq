sql2bq
---

Query data from SQL DB and dump data into bigquery.

### Install

```
git clone https://github.com/charlesfan/sql2bq.git
cd sql2bq && npm install
```

### Create Config File

In the GCP current version service account, you just need to create service account and download the json credential file for use. Here is the config template sample, that you can create yourself config into sql2bq/lib/config/cfg.js or use the sql2bq-init command for generate...

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
  projectId: '$projectID',
  dataset: '$dataset',
  json_file: '$json_file'
}
exports.bq = bq;
```

sql2bq-init generate sample:

```
./bin/sql2bq-init

=============================================================
Welcome to use sql2bq
=============================================================

Beafore create init file, please apply service account first.
Follow the doc: http://gappsnews.blogspot.tw/2013/10/connect-cloud-platform-bigquery-using.html

=============================================================

Start create the config of BQ and SQL DB.

=============================================================

Your project ID: mitac-cp300
The name of BigQuery dataset: test
The PATH of Service Account json file: /Users/peihsinsu/.gcpkeys/mitac-cp300/mitac-cp300-e75b19c172ba.json
Local DB' IP address: localhost
Local DB' port: 3306
DB User: root
DB password: 1234qwer
Database name: test
User's input:  { projectID: 'mitac-cp300',
  dataset: 'test',
  json_file: '/Users/peihsinsu/.gcpkeys/mitac-cp300/mitac-cp300-e75b19c172ba.json',
  ipAddress: 'localhost',
  port: '3306',
  dbAccount: 'root',
  dbpwd: '1234qwer',
  dbName: 'test' }
```

Check your config file (sql2bq/lib/config/cfg.js) and start use this sdk.

### Do Query

You can just use sql command to query your data from SQL DB and upload to your bq.
```
bin/mysql -q 'select * from <db_table>' -t <bq_name>
```
The operation: -q and -t are require when you use this sdk. We provide some operations in this sdk:
```
-p, --project <project>, Specify the BigQuery project

-d, --dataset <dsname>, Specify the dataset name

-q, --query <command>, Specify the sql command you want input(require)

-t, --table <tablename>, Specify the table name(require)
```

Here is a example to doing SQL query and transfer data to BigQuery

```
./bin/sql2bq -q "select * from test.Persons" -t mysqltest
using createConnection, mysqlcfg: {"host":"localhost","port":3306,"user":"root","password":"1234qwer","database":"mysql"}
Start query DB: [SQL] select * from test.Persons
[BQ: Get Table] Start find table: mysqltest
Table: mysqltest does not exist
Schema ===>  { fields:
   [ { name: 'PersonID', type: 'INTEGER' },
     { name: 'LastName', type: 'STRING' },
     { name: 'FirstName', type: 'STRING' },
     { name: 'Address', type: 'STRING' },
     { name: 'City', type: 'STRING' } ] }
[Table Created]: {"kind":"bigquery#table","etag":"\"oGMCL../VzoRUv1WPqj7bNukINq151qWFCE\"","id":"mitac-cp300:test.mysqltest","selfLink":"https://www.googleapis.com/bigquery/v2/projects/mitac-cp300/datasets/test/tables/mysqltest","tableReference":{"projectId":"mitac-cp300","datasetId":"test","tableId":"mysqltest"},"schema":{"fields":[{"name":"PersonID","type":"INTEGER"},{"name":"LastName","type":"STRING"},{"name":"FirstName","type":"STRING"},{"name":"Address","type":"STRING"},{"name":"City","type":"STRING"}]},"numBytes":"0","numLongTermBytes":"0","numRows":"0","creationTime":"1463914271112","lastModifiedTime":"1463914271112","type":"TABLE"}
BQ project: mitac-cp300
BQ dataset: test
Insert data:  [ RowDataPacket {
    PersonID: 1,
    LastName: 'Simon',
    FirstName: 'Su',
    Address: 'my address',
    City: 'taipei' } ]
[INSERT RESULT]{"kind":"bigquery#tableDataInsertAllResponse"}
```
