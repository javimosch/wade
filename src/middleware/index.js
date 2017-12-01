import { Router } from 'express';
import passport from 'passport';
var session = require('express-session');
import mongoose from 'mongoose';
import cors from 'cors';
var cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
var passportSocketIo = require('passport.socketio');
var bodyParser = require('body-parser');
import * as lib from '../lib';
export var jsonParser = bodyParser.json({
	limit: '50mb'
});

export default ({ config, db, app, io }) => {
	let routes = Router();


	//app.use(cors());

	let User = mongoose.model('user');
	/*
	passport.serializeUser(function(user, done) {
		console.log('serializeUser user', user);
		done(null, user._id);
	});

	passport.deserializeUser(function(_id, done) {
		console.log('Deserialize user called.', _id);
		User.findById(_id, function(err, user) {
			done(err, user);
		});
	});*/

	// add middleware here

	let mongoStore = new MongoStore({
		url: process.env.MONGO_URI,
		collection: 'sessions'
	});
	const SESSION_SECRET = 'asdf33g4w4hghjkuil8saef345';

	///app.use(cookieParser(SESSION_SECRET));

	const cookieExpirationDate = new Date();
	const cookieExpirationDays = 365;
	cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

	let sessionInstance = session({
		secret: SESSION_SECRET,
		//	rolling:true,
		saveUninitialized: false,
		resave: false,
		store: mongoStore,
		//cookie: {
		//httpOnly: false,
		//	secure: true,
		//expires: cookieExpirationDate
		//	}
	});

	app.use(sessionInstance);

	/*
		io.use(passportSocketIo.authorize({
			key: 'connect.sid',
			secret: SESSION_SECRET,
			store: mongoStore,
			passport: passport,
			cookieParser: cookieParser,
			success: onAuthorizeSuccess,
			fail: onAuthorizeFail
		}));
	*/
	//app.use(passport.initialize());
	//app.use(passport.session());

	app.use(lib.security.parseUserFromSession());

	let sharedsession = require("express-socket.io-session");

	io.use(sharedsession(sessionInstance));



	return routes;
};

function onAuthorizeSuccess(data, accept) {
	console.log('successful connection to socket.io');

	// The accept-callback still allows us to decide whether to
	// accept the connection or not.
	accept(null, true);

	// OR

	// If you use socket.io@1.X the callback looks different
	accept();
}

function onAuthorizeFail(data, message, error, accept) {
	console.log('failed connection to socket.io:', message);
	//accept(null, false);
}
