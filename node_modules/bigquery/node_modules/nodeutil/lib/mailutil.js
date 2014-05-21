var nodemailer = require("nodemailer")
  , log = require('./logger').getInstance()
  , os = require('os')
  , fs = require('fs')
  , cfg = null
  , smtpOption = {}
  , smtpTransport = null
  , _ = require('underscore')
  , cfg_path = process.env.HOME + '/.nmail';

var mailutil = exports;

exports.init = function(json){
  if(json) {
    log.debug('Setting the cfg using json...' );
    log.debug(json);
    cfg = json;
    log.debug('Confirm cfg:');
    log.debug(cfg);

    smtpOption = json.smtpOptions;
  }
  initial();
}

/* node.js v0.6.x still no fs.existsSync() */
function isCfgExists() {
  try {
    fs.statSync(cfg_path);
    return true;
  } catch(e) {
    return false;
  }
}

function initial(){
  if(!cfg || cfg == null)
    if(isCfgExists()) {
      cfg =  require('../lib/cfgutil').readJsonCfg(cfg_path);
    } else {
      cfg = {smtpOptions:{host : "localhost"}};
    }
  smtpOption = cfg.smtpOptions;
  smtpTransport = nodemailer.createTransport("SMTP", smtpOption);
  mailutil.smtpOption = smtpOption;

  /**
   * SMTP transport object
   */
  smtpTransport = nodemailer.createTransport("SMTP", smtpOption);

  /**
   * To set the SMTP transport using option
   */
  mailutil.setSmtpTransUsingOption = function(opt){
    smtpTransport = nodemailer.createTransport("SMTP", opt);
  };

  /**
   * To reset the SMTP transport using the last smtpOption 
   */
  mailutil.resetSmtpTrans = function() {
    smtpTransport = nodemailer.createTransport("SMTP", this.smtpOption);
  };
}

/**
 * Mail options default object
 */
var mailOptions = {
    from: os.hostname()  , // sender address
    to: "receiver@mycompany.com", // list of receivers
    subject: "Hello Send From NMAIL", // Subject line
    text: "Dear:\n\n Hello, this is a sample mail. \n That you are success send this mail!\n]n Thanks.", // plaintext body
    html: "Dear:<br/><br/>Hello, this is a sample mail from <font color=red>nmail<font>. <br/>That you are success send this mail!  <br/><br/>Thanks." // html body
}

/**
 * Mail options for setting from, to, subject, content(text or html)
 */
mailutil.mailOptions = mailOptions;

/**
 * Main function for send mail
 */
function sendMail(sender, receivers, subject, msg, isClose, callback) {
  var opt = _.clone(mailOptions);

  if(sender) opt.from = sender;
  opt.to = receivers;
  opt.subject = subject;
  if(opt.text) delete opt.text;
  opt.html = msg;
  log.debug('[INFO]Using smtpOption:');
  log.debug(smtpOption);
  log.debug('[INFO]Using mailOptions:');
  log.debug(opt);
  smtpTransport.sendMail(opt, function(error, response){
    if(error){
       log.error('[ERROR]%s',JSON.stringify(error));
    } else {
       log.debug("Message sent: " + response.message);
    }
    if(isClose)
      smtpTransport.close(); // shut down the connection pool, no more messages
    if(callback) {
      callback(response);
    }
  });
}

/**
 *  opts parameter format: (ref: https://github.com/andris9/Nodemailer#attachment-fields)
 *  from - The e-mail address of the sender. All e-mail addresses can be plain sender@server.com or formatted Sender Name <sender@server.com>
 *  to - Comma separated list or an array of recipients e-mail addresses that will appear on the To: field
 *  cc - Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field
 *  bcc - Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field
 *  replyTo - An e-mail address that will appear on the Reply-To: field
 *  inReplyTo - The message-id this message is replying
 *  references - Message-id list
 *  subject - The subject of the e-mail
 *  text - The plaintext version of the message
 *  html - The HTML version of the message
 *  generateTextFromHTML - if set to true uses HTML to generate plain text body part from the HTML if the text is not defined
 *  headers - An object of additional header fields {"X-Key-Name": "key value"} (NB! values are passed as is, you should do your own encoding to 7bit if  needed)
 *  attachments - An array of attachment objects.
 *  alternatives - An array of alternative text contents (in addition to text and html parts)
 *  envelope - optional SMTP envelope, if auto generated envelope is not suitable
 *  messageId - optional Message-Id value, random value will be generated if not set. Set to false to omit the Message-Id header
 *  date - optional Date value, current UTC string will be used if not set
 *  encoding - optional transfer encoding for the textual parts (defaults to "quoted-printable")
 *  charset - optional output character set for the textual parts (defaults to "utf-8")
 */
function sendNodeMail(opts, isClose, callback){
  log.debug('[INFO]Using smtpOption:');
  log.debug(smtpOption);
  log.debug('[INFO]Using mailOptions:');
  log.debug(opts);
  smtpTransport.sendMail(opts, function(error, response){
    if(error){
       log.error('[ERROR]%s',JSON.stringify(error));
    } else {
       log.debug("Message sent: " + response.message);
    }
    if(isClose)
      smtpTransport.close(); // shut down the connection pool, no more messages
    if(callback) {
      callback(response);
    }
  });
}
exports.sendNodeMail = sendNodeMail;

/**
 * Send mail without waiting the response
 */
mailutil.sendNodeMailAsync = function(receivers, subject, msg, isClose) {
  sendMail(cfg.sender, receivers, subject, msg, isClose);
}

/**
 * Send mail and have a callback with response after mail sent
 */
mailutil.sendNodeMailSync = function(receivers, subject, msg, isClose, callback) {
  sendMail(cfg.sender, receivers, subject, msg, isClose, callback);
}

/**
 * Sample of mail object
 */
var mo = {
  sender:"",
  receivers:[],
  subject:"Test mail",
  contentTemplate:"~/tmpl/sample.tpl",
  contentValues:{key:"value"}
}

/**
 * Send mail using template
 */
exports.sendTemplateMail = sendTemplateMail;
function sendTemplateMail(mo, callback){
  var sender = mo.sender ? mo.sender : cfg.sender;
  var isClose = mo.isClose ? mo.isClose : true;
  sendMail(sender, mo.receivers, 
    mo.subject, convertTemplateMail(mo.contentTemplate, mo.contentValues),
    isClose, callback);
} 

function convertTemplateMail(tpl_path, opt){
  var template = fs.readFileSync(tpl_path,'UTF-8');
  if(opt){
    var keys = Object.keys(opt);
    keys.forEach(function(v,i){
      var value = opt[v];
      template = template.replace(new RegExp('\\\$' + v, 'g'),value);
    });
  }
  return template;
}





