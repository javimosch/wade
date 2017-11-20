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
import {jsonParser} from '../middleware';
import * as lib from '../lib';
import mongoose from 'mongoose';
export default ({
	config,
	db,
	app
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
	
	
	 let User = mongoose.model('user');
	 app.post('/api/v1/login', jsonParser, lib.security.isAuthenticated, (req, res) => {
        User.update({ "_id": req.user._id },
          { "$set": {connected: true} },
          function(err, data) {
              if (err) {
                  console.error(err);
              }

              req.session.save();
              res.status(200).json({
                id: req.user._id,
                firstname: req.user.firstname || '',
                lastname: req.user.lastname || '',
                email:req.user.email,
                type: req.user.user_type || ''
              });
            }
        );
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