import * as dotenv from 'dotenv';
dotenv.config({
	silent: true
});
import * as tracer from 'tracer';
const console = tracer.colorConsole();

if (!process.env.FIREBASE_CONFIG_FILE) {
	console.error('Firebase required');
	process.exit(1);
}
console.log("process.env.FIREBASE_CONFIG_FILE", process.env.FIREBASE_CONFIG_FILE);


//console.log(process.env)

import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import path from 'path';
import rimraf from 'rimraf';
import PrettyError from 'pretty-error';
PrettyError.start();
let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit: config.bodyLimit
}));

function createSocketIoPromisedAction(socket, name, handler) {
	//console.log('socket action',name,socket.id);
	socket.on(name, function(request) {
		if (!request.identifier) throw new Error('Incoming request identifier missing (' + name + ')');
		let identifier = request.identifier;
		console.log('calling', name);
		handler(request.data).then(res => {
			console.log('Socket action resolve',name,res);
			socket.emit(name + '_resolve_' + identifier, res);
		}).catch(err => {
			console.error('Socket action reject', name, err.message);
			socket.emit(name + '_reject_' + identifier, err.message);
		});
	});
}

function createSocketIoMongooseCrud(socket, db, collectionName, opts = {}) {
	async function crudSave(data) {
		if (opts.middlewares && opts.middlewares.save) {
			opts.middlewares.save.forEach((handler) => handler(data));
		}
		console.log('Data', data)
		let doc;
		let model = db[collectionName];
		if (!data) {
			throw new Error('data required');
		}
		if (!data._id && typeof data._id !== 'undefined') delete data._id;
		if (data._id) {
			console.log(`saving (update) ${collectionName}`, data);
			doc = await model.findById(data._id);
			if (!doc) {
				throw new Error('_id mistmatch');
			}
			let payload = Object.assign({}, data);
			delete payload._id;
			await model.update({
				_id: data._id
			}, {
				$set: payload
			}).exec();
			doc = await model.findById(data._id);
		}
		else {
			console.log(`saving (create) ${collectionName}`, data);
			doc = await model.create(data);
		}
		return doc.toJSON();
	}
	createSocketIoPromisedAction(socket, `save_${collectionName}`, crudSave);

	createSocketIoPromisedAction(socket, `remove_${collectionName}`, async(data) => {
		let model = db[collectionName];
		console.log(`removing ${collectionName}`, data);
		let info = await model.findByIdAndRemove(data._id).exec();
		console.log(info);
		return data;
	});

	createSocketIoPromisedAction(socket, `${collectionName}_list`, async(data) => {
		if (opts.middlewares && opts.middlewares.list) {
			opts.middlewares.list.forEach((handler) => data = handler(data));
		}
		let model = db[collectionName];
		let docs = await model.find({}).exec();
		docs = docs.map(d => d.toJSON());
		console.log(`fetching ${collectionName}s`, docs.length);
		return docs;
	});
}

// connect to db
initializeDb(db => {

	var io = require('socket.io')(app.server);

	app.use(function(req, res, next) {
		req.connection.setTimeout(1000 * 60 * 10); // ten minutes
		next();
	});

	var webpack = require('webpack');
	var webpackConfig = require('../webpack.config');
	var compiler = webpack(webpackConfig);
	if (process.env.NODE_ENV !== 'production') {
		rimraf.sync(path.join(process.cwd(), 'public'));
		app.use(require("webpack-dev-middleware")(compiler, {
			noInfo: true,
			publicPath: '/'
		}));
		app.use(require("webpack-hot-middleware")(compiler));
	}
	else {
		app.use('/', express.static(path.join(process.cwd(), 'public')));
		compiler.run((err, stats) => {
			if (stats.compilation.errors) {
				stats.compilation.errors.forEach(err => {
					console.log(err);
				});
			}
			console.log(err, stats);
		});
	}



	// internal middleware
	app.use(middleware({ config, db, app, io }));

	io.on('connection', function(socket) {
		(async() => {
			console.log('SOCKET CONNECTION', socket.id, socket.handshake.session.user_id);
			let user = await db.user.findById(socket.handshake.session.user_id).exec();
			if (!user) {
				throw new Error('Current user cannot be detected');
			}
			createSocketIoMongooseCrud(socket, db, 'module', {
				middlewares: {
					save: [(data) => {
						data.owner = user._id;
					}]
				}
			});
			socket.emit('constructor_resolve');
		})().catch(err => {
			console.error(err);
			socket.emit('constructor_reject', err);
		});

	});

	// api router
	app.use('/api', api({ config, db, app }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${process.env.IP}:${app.server.address().port}`);
	});
});

export default app;
