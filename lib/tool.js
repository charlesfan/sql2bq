exports.jsonParser = function(data, fn){
	//var ops = JSON.parse(data)
	var	jFile = '';

	for(var i=0 ; i<data.length ; i++){
		jFile += JSON.stringify(data[i]) + '\n';
	}
	fn(jFile);
}
