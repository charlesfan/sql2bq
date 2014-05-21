var util = require('util');                                                                                                                                            
  
/**
 * Example:
 * var sql = "insert into xxxx (%s) values (%s)";
 * var opt = {}
 * opt["k1"] = 'v1';
 * opt["k2"] = 'v2';
 * var s = sql.buildSql(sql, opt);
 * console.log(JSON.stringify(s));
 */
function buildSql(sql, params){
  var k = '', v = '';
  var arr = Object.keys(params);
  var cond = [];
  for(var i = 0 ; i < arr.length ; i++){
      k += arr[i] ;
      v += '?';
      if(i < arr.length -1){
        k += ',';
        v += ',';
      }
      cond.push(params[arr[i]]);
  }
  var finalsql = util.format(sql,k,v)
  return {sql:finalsql, cond:cond};
}
exports.buildSql = buildSql;
