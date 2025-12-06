

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passport');
const passwordRouter = require("./routes/password");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Expose session and user to all views
app.use(function(req, res, next) {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use("/", require("./routes/auth"));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use("/password", require("./routes/password"));


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  res.status(err.status || 500);
  res.render('error', { error: err });
});

const connectDB = require('./db');
connectDB();

module.exports = app;
