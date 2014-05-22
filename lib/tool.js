exports.jsonParser = function(data, fn){
	//var ops = JSON.parse(data)
	var	jFile = '';

	for(var i=0 ; i<data.length ; i++){
		jFile += JSON.stringify(data[i]) + '\n';
	}
	fn(jFile);
}

exports.createConf = function(opt, tmp){
	var template = tmp;
	if(opt){
		var keys = Object.keys(opt);
		keys.forEach(function(v,i){
			var value = opt[v];
			template = template.replace(new RegExp('\\\$' + v, 'g'),value);
		});
	}
	return template;
}
