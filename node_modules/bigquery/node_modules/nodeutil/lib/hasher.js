var crypto = require('crypto')
  , strategy = 'aes-256-cbc'
  , encoding = 'utf8'
  , hex = 'hex';

/**
 * initialize the parameters
 */
exports.init = function(opts) {
  if(opts) {
    if(opts.strategy) strategy = opts.strategy;
    if(opts.encoding) encoding = opts.encoding;
    if(opts.hex) hex = opts.hex;
  }
}

/**
 * encrypt text
 */
exports.encrypt = function(seed, text){
  if(typeof(seed) != 'string') {
    throw "[Encrypt Error] the seed need to be a string"
  }
  var cipher = crypto.createCipher( strategy, seed)
  var crypted = cipher.update(text,encoding,hex)
  crypted += cipher.final(hex);
  return crypted;
}

/**
 * decrypt text
 */
exports.decrypt = function (seed, text){
  if(typeof(seed) != 'string') {
    throw "[Decrypt Error] the seed need to be a string"
  }
  var decipher = crypto.createDecipher(strategy, seed)
  var dec = decipher.update(text,hex,encoding)
  dec += decipher.final(encoding);
  return dec;
}
