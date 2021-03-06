var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectRouter = require('./routes/projects');
var courseRouter = require('./routes/courses');

// passport libraries for auth
const passport = require("passport")
const session = require("express-session")
const gitHubStrategy = require('passport-github2').Strategy

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure session & passport BEFORE mapping the controllers. required for controllers to use passport
app.use(session({
  secret: 'w21Pr0jectTracker',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

//global variables config file
const config = require('./config/globals')

// link passport to our model that extends passport-local-mongoose
const User = require('./models/user')
passport.use(User.createStrategy())

//configure passport-github2 auth
passport.use(new gitHubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL:config.github.callbackUrl
},

  //after successful github login register or login user.
  async(accessToken, refreshToken, profile, done) => {
    //does github user already exist in our db?
    const user = await User.findOne({oauth: profile.id})

    if(user){
      return done(null, user)
    }
    else {
      const newUser = new User({
        username: profile.username,
        oauthId: profile.id,
        oauthProvider: 'GitHub',
        created: Date.now()
      })

      const savedUSer = await newUser.save()
      done(null, savedUser)
    }
  }

  ))

// set passport so it read / write user data to / from session object
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectRouter);
app.use('/courses', courseRouter);

// mongodb connection
const mongoose = require('mongoose');

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then((res) => {
      console.log('Connected to MongoDB')
    }).catch(() => {
      console.log('MongoDB Connection Failed')
})

//  hbs helper function to pre-select a correct dropdown
const hbs = require('hbs')
hbs.registerHelper('createOption', (currentValue, selectedValue) => {
  var selectedProperty = ''
  if(currentValue == selectedValue){
    selectedProperty = ' selected'
  }
  return new hbs.SafeString('<option' + selectedProperty + '></option>')
})

hbs.registerHelper('shortDate', (dateVal) => {
  return new hbs.SafeString(dateVal.toLocaleDateString('en-US'))
})

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

module.exports = app;
