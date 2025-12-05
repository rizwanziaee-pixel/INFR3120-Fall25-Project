// app.js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passport');

// IMPORT ALL ROUTES
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var profileRouter = require('./routes/profile');  // ADD THIS LINE

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Expose session, user, and flash messages to all views
app.use(function(req, res, next) {
  res.locals.session = req.session;
  res.locals.user = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ============================================
// ROUTES - ORDER MATTERS!
// ============================================
app.use('/', authRouter);      // Auth routes first
app.use('/', profileRouter);   // Profile routes second
app.use('/', indexRouter);     // Index routes third
app.use('/users', usersRouter); // Users routes last

// ============================================
// 404 handler - MUST BE AFTER ALL ROUTES
// ============================================
app.use(function(req, res, next) {
  next(createError(404));
});

// ============================================
// Error handler - MUST BE LAST
// ============================================
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  res.status(err.status || 500);
  res.render('error', { error: err, title: 'Error' });
});

// Database connection
const connectDB = require('./db');
connectDB();

module.exports = app;