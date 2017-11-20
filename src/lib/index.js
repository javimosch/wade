var fs = require('fs');
let self = module.exports = {};
fs.readdirSync(__dirname).forEach(function(file) {
	if (file == "index.js") return;
	if (file.indexOf('.js')===-1) return;
	var name = file.substr(0, file.indexOf('.'));
	var req = require('./' + name);
	if(typeof req === 'function'){
		if(req.then && req.catch){
			self[name] = req;	
		}else{
			self[name] = req();
		}
	}else{
		self[name] = req;	
	}
});