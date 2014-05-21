/**
 * Get the current time string using format 
 */
exports.getNowString = function(format){
  return this.getDateString(new Date(), format);;
}

/**
 * Get the given time string using format
 */
exports.getDateString = function(date, format){
  var now = date;
  var yyyy = now.getYear() + 1900;
  var mm = now.getMonth() + 1;
  var dd = now.getDate();
  var hh24 = now.getHours();
  var mi = now.getMinutes();
  var ss = now.getSeconds();
  var rep = [yyyy,mm,dd,hh24,mi,ss];
  var repx = ['yyyy','mm','dd','hh24','mi','ss'];

  var result = format;
  for(var i=0; i< rep.length; i++) {
      var r = rep[i] < 10 ? '0'+rep[i] : rep[i];
      result = result.replace(repx[i], r);
  };
  return result;
}

exports.getDateFromString = function(dateString, format){

}

