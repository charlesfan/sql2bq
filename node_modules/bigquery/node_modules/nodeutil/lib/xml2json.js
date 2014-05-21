var xml2js = require('xml2js')
  , fs = require('fs')

/**
 * example: 
 * nu.xml2json.toJson(fs.readFileSync('sample.xml', 'utf8'), function(err, result){
 *   if(err) console.log(err);
 *   console.log(result);
 *});
 */
function toJson(xml, opt, cb) {
  if(typeof opt === 'function') {
    cb = opt;
    opt = {trim: true, explicitArray: false};
  }
  xml2js.parseString(xml, opt, function (err, result) {
      return cb(err, result);
  });
}
exports.toJson = toJson;

/**
 * example:
 * nu.xml2json.file2json('sample.xml', function(err, result){
 *   if(err) console.log(err);
 *   console.log(result);
 * });
 */
exports.file2json = function(filename, opt, cb) {
  var xml = fs.readFileSync(filename, 'utf8');
  toJson(xml, opt, cb);
}
