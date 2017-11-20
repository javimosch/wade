import * as lib from './lib';
export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	if(!process.env.MONGO_URI){
		throw new Error('process.env.MONGO_URI required');
	}
	var mongoose = require('mongoose');
	mongoose.connect(process.env.MONGO_URI);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		
		lib.model.configure();
		
		callback();
	});

	//callback();
};
