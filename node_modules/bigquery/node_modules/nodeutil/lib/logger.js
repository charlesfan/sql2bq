/**
 * Usage: 
 * var logger = require('nodeutil').logger.getInstance();
 * logger.debug('TEST...123');
 */
var log4js = require('log4js')
  , logFile = process.env.LOGPATH ? process.env.LOGPATH : '/tmp/node.log'
  , logCategory = process.env.LOGCATG ? process.env.LOGCATG : 'normal'
  , logLevel = process.env.LOGLEVEL ? process.env.LOGLEVEL : 'DEBUG'
  , logMaxSize = process.env.LOG_MAX_SIZE ? process.env.LOG_MAX_SIZE : 204800
  , logBackup = process.env.LOG_BACKUP ? process.env.LOG_BACKUP : 7;
/*
//log4js.loadAppender('console');
log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.console());
log4js.addAppender(log4js.appenders.file(logFile), logCategory);
*/
/* another log config
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/cheese.log', category: 'cheese' }
  ]
});
*/

log4js.configure(
{
  "appenders": [
    { type: 'console' },
    {
      "type": "file",
      "filename": logFile,
      "maxLogSize": logMaxSize,
      "backups": logBackup,
      "category": logCategory
    }
  ]
}
);


exports.getInstance = function(catg) {
  var logger;
  if(catg) {
    logger = log4js.getLogger(catg);
  } else {
    logger = log4js.getLogger(logCategory);
  }
  logger.setLevel(logLevel);
  return logger;
}
