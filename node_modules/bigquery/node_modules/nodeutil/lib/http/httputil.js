var http = require('http');
var qs = require('querystring');
var util = require('util');

exports.srvinfo={
  host : 'www.google.com',
  port : 80,
  path:'/?q=micloud',
  method:'POST'
};

/**
 * Simple Get module
 */
exports.doGet = function(options, callback){
  http.get(options, function(res) {
    log("Got response status code: " + res.statusCode);
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end',function(){
      callback(res.statusCode, JSON.stringify(res.headers), data);
    });
  }).on('error', function(e) {
    log("Got error: " + e.message);
  });
}

exports.doGetDataURI = function(options, callback){
  http.get(options, function(res) {
    log("Got response status code: " + res.statusCode);
    var data = '';
    var type = res.headers["content-type"],
        prefix = "data:" + type + ";base64,";
    res.setEncoding('binary');

    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end',function(){
      var base64 = new Buffer(data, 'binary').toString('base64'),
          imagedata = prefix + base64;
      callback(res.statusCode, JSON.stringify(res.headers), imagedata);
    });
  }).on('error', function(e) {
    log("Got error: " + e.message);
  });
}

exports.doRequest = function(options, callback) {
    log(util.format('[%s]http://%s:%s%s',options.method, options.host, options.port, options.path));
    var params = '';
    var statusCode = '';
    var headers = '';
    var request = http.request(options, function(res) {
      if(options.method == 'POST'){
        if(options.data){
          params = qs.stringify(options.data);
          options.headers = {};
          options.headers['Content-Length'] = params.length;
        }
      }
      statusCode = res.statusCode;
      headers = JSON.stringify(res.headers);
      log('[INFO]Status : ' + statusCode);
      log('[INFO]Hearder : ' + headers);
      res.setEncoding('utf-8');
    });
    
    var data = '';
    request.on('response', function(res){
      log('Enter request.on...');
      res.on('data', function(chunk) {
        log('Enter res.on(data)...');
        data += chunk;
      });

      res.on('end',function(){
        log('Enter res.on(end)...');
        if(statusCode == 500) {
            callback(statusCode,headers,'{"error":"Request data error!"}');
        } else {
            callback(statusCode,headers,data);
        }
      });
    });
    
    request.on('error', function(e) {
      log('[ERROR]' + JSON.stringify(e));
      log('[ERROR]problem with request: ' + e.message);
    });

    /**
     * For solve the problem of node.js 0.6.18:
     * Error: Parse Error
     *   at Socket.socketOnData (http.js:1288:20)
     *   at TCP.onread (net.js:374:27)
     */
    request.on('socket', function(socket) {
       socket.on('error', function(err) {
         if(!callback.called) { 
            log('[WARNING]socket on error');
            //callback('socket error: ' + err);
            callback.called = true; 
         } 
         request.abort();
       });
    });

    if(options.method == 'POST' && options.data){
      request.write(params);
    } else {
      request.write('data\n');
    }
    request.write('data\n');
    request.end();
}

/**
  * ex:
  * var post_options = {
  *    host: '211.78.255.15',
  *    port: '301',
  *    path: '/addrec',
  *    method: 'POST',
  *    headers : {
  *      'Content-Type' : 'multipart/form-data; boundary=' + boundary,
  *      'Content-Length' : Buffer.byteLength(post_data)
  *    }
  *  };
  *
  * service.doPostJsonDataForm(post_options, 'data', json, function(){
  *   ....
  * });
  */
exports.doPostJsonDataForm = function(post_options, key, jsonData, callback) {
  var boundary = Math.random();
  var post_data = '';
  log('[Info]Will put data:%s',JSON.stringify(jsonData));
  post_data += EncodeFieldPart(boundary, key, JSON.stringify(jsonData));
  post_data += "--" + boundary + "--";
  post_options.headers = {
        'Content-Type' : 'multipart/form-data; boundary=' + boundary,
        'Content-Length' : Buffer.byteLength(post_data)
  };

  var post_request = http.request(post_options, function(response){
    response.setEncoding('utf8');
    response.on('data', function(chunk){
      callback(chunk);
    });
  });

  post_request.write(post_data);
  post_request.end();
}

function EncodeFieldPart(boundary,name,value) {
    var return_part = "--" + boundary + "\r\n";
    return_part += "Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n";
    return_part += value + "\r\n";
    return return_part;
}

function EncodeFilePart(boundary,type,name,filename) {
    var return_part = "--" + boundary + "\r\n";
    return_part += "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"\r\n";
    return_part += "Content-Type: " + type + "\r\n\r\n";
    return return_part;
}

function log(msg){
  util.log(msg);
}
