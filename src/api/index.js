import {
	description,
	version
} from '../../package.json';
import {
	Router
} from 'express';
import facets from './facets';
import path from 'path';
import compareVersion from 'compare-versions';
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

	api.get('/update/:version', (req, res) => {

		var IP = process.env.IP || "http://localhost:8081"

		if(compareVersion(req.params.version,version)!==-1){
			return res.status(404).send();
		}

		let rta = {
			"url": IP + "/api/download",
			"name": version,
			"notes": "",
			"pub_date": description
		};

		res.json(rta);
	});

	return api;
}