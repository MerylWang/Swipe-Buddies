var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");

// var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var matchesRouter = require('./routes/matches');

var app = express();

app.use(session({ secret: "aBAKJ389*&@^#^]9]kdjfhsldkf3#@%", resave: true, saveUninitialized: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/matches', matchesRouter); 

// passport
const passport = require('./src/passport');
// hook up passport
app.use(passport.initialize());
app.use(passport.session());

// authentication routes
app.get('/auth/mitopenid', passport.authenticate('mitopenid'));

// authentication callback routes
app.get('/auth/mitopenid/callback', passport.authenticate('mitopenid', {
	successRedirect: '/#/home',
	failureRedirect: '/'
}), function(req, res) {
    //  console.log(req.user);
     req.session.username = req.user;
  });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const Matcher = require('./models/Match').Matcher;
const Event = require('./models/Event');
const cron = require('node-cron');
cron.schedule("05 00 * * *", function() {
  let day = Event.todaysDate();
  Matcher.match(day);
}, {scheduled: true, timezone: "America/New_York"});


module.exports = app;
