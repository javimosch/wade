import {
	version
} from '../../package.json';
import {
	Router
} from 'express';
import facets from './facets';
import path from 'path';
export default ({
	config,
	db
}) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({
		config,
		db
	}));

	api.get('/download', (req, res) => {

		var file = path.join(process.cwd(), "releases/slti-" + version+'-mac.zip');
		res.download(file);
	});

	api.get('/', (req, res) => {

		var IP = process.env.IP || "http://localhost:8081"

		let rta = {
			"url": IP + "/api/download",
			"name": "1.0.5",
			"notes": "",
			"pub_date": "2017-11-13T16:13:58.000Z"
		};

		res.json(rta);
	});

	return api;
}