var mailutil = require('../lib/mailutil');
var subject = process.argv[2];
var receivers = process.argv[3].split(',');
var msg = process.argv[4];
mailutil.sendNodeMail(receivers, subject, msg);
