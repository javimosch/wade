import * as dotenv from 'dotenv';
dotenv.config({
  silent: true
});
import * as tracer from 'tracer';
const console = tracer.colorConsole();

if(!process.env.FIREBASE_CONFIG_FILE){
	console.error('Firebase required');
	process.exit(1);
}
console.log("process.env.FIREBASE_CONFIG_FILE",process.env.FIREBASE_CONFIG_FILE);


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

// connect to db
initializeDb(db => {

	// internal middleware
	app.use(middleware({ config, db,app }));

	var io = require('socket.io')(app.server);
	io.on('connection', function(socket) {
		socket.emit('news', { hello: 'world' });
		socket.on('my other event', function(data) {
			console.log(data);
		});
	});

	// api router
	app.use('/api', api({ config, db,app }));

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

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${process.env.IP}:${app.server.address().port}`);
	});
});

export default app;
