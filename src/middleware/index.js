import { Router } from 'express';
import passport from 'passport';
var session = require('express-session');
import mongoose from 'mongoose';
import cors from 'cors';
var cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);

var bodyParser = require('body-parser');

export var jsonParser = bodyParser.json({
	limit: '50mb'
});

export default ({ config, db, app }) => {
	let routes = Router();

	let User = mongoose.model('user');
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(_id, done) {
		User.findById(_id, function(err, user) {
			done(err, user);
		});
	});

	// add middleware here

	app.use(cookieParser('asdf33g4w4hghjkuil8saef345'));
	const cookieExpirationDate = new Date();
	const cookieExpirationDays = 365;
	cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);
	app.use(session({
		secret: 'asdf33g4w4hghjkuil8saef345',
		saveUninitialized: false,
		resave: true,
		store: new MongoStore({
			url: process.env.MONGO_URI,
			collection: 'sessions'
		}),
		cookie: {
			HttpOnly: false,
			secure: false,
			expires: cookieExpirationDate
		}
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(cors());

	return routes;
};
