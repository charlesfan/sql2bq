sql2bq
---

Query data from SQL DB and dump data into bigquery.

### Install

```
git clone https://github.com/charlesfan/sql2bq.git
cd sql2bq && npm install
```

If you don't have google client_secret, privatekey_pem or key_pem, follow the doc: http://gappsnews.blogspot.tw/2013/10/connect-cloud-platform-bigquery-using.html before you create init file.

### Create Config File

```
node bin/init.js
```

### Query Tag

```
-p, --project <project>, Specify the BigQuery project

-d, --dataset <dsname>, Specify the dataset name

-q, --query <command>, Specify the sql command you want input(require)

-t, --table <tablename>, Specify the table name(require)
```

### Do Query

You can just use sql command to upload your data to bigquery from SQL DB.
```
node bin/mysql.js -q 'select * from <db_table>' -t <bq_name>
```
