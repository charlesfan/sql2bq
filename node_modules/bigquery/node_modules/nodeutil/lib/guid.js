var util = require('util');

var pattern_passwd = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789!@#$%&*';  
var pattern_account = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789';  
var pattern_simple_account = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';  

/**
 * 使用pattern當樣板，產生一個preSize位亂數 + 十六位元時間字串 + postSize位亂數的文字
 * ex: this.getGuid('%s-%s-%s', 2,3) => 'ZL-13ecba94890-5BE'
 */
exports.getGuid = function(pattern, preSize, postSize){
  var r = new Date().getTime();//.toString(16);
  return this.getGuidWithSeed(r, pattern, preSize, postSize);
}

/**
 * ex: this.getGuidWithSeed('12345667', '%s-%s-%s', 2,3).toUpperCase()
 */
exports.getGuidWithSeed = function(seed, pattern, preSize, postSize){
  if(isNaN(seed)) {
    console.error('[NODEUTIL ERR]ERR NUMBER FORMAT');
    return "";
  }
  var r = seed.toString(16);
  return util.format(pattern, randomString(preSize, pattern_account), r, 
    randomString(postSize, pattern_account)); 
}

function randomString(plength, rangeString){
  var keylist = rangeString;
  var temp=''
  for (i=0;i<plength;i++)
  temp+=keylist.charAt(Math.floor(Math.random()*keylist.length))
  return temp
}

exports.getSimpleGuidWithSeed = function(seed, pattern, preSize, postSize){
  if(isNaN(seed)) {
    console.error('[NODEUTIL ERR]ERR NUMBER FORMAT');
    return "";
  }
  var r = seed.toString(16);
  return util.format(pattern, randomString(preSize, pattern_simple_account), r, 
    randomString(postSize, pattern_account)); 
}

exports.getSimpleGuid = function(pattern, preSize, postSize){
  var r = new Date().getTime();//.toString(16);
  return this.getSimpleGuidWithSeed(r, pattern, preSize, postSize);
}
