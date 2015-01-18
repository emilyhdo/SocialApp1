var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var passport = require('./auth');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
// var users = require('./routes/users');

var db = require('./db');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
     secret: 'secret',
     store: new MongoStore({
        url: 'mongodb://bricksquad:bricksquad@ds031601.mongolab.com:31601/socialapp'
     }),
     resave: false,
     saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


// app.use('/', routes);
// app.use('/users', users);
app.get('/', function(req, res){
    if (req.session.passport.user == undefined){
      res.render('index', {username: "Guest", var1: "signin", var2: "Sign in"});
    }else{
      res.render('index', {username: req.session.passport.user, var1: "signout", var2: "Sign out"});
    }
});
app.get('/signup', function(req, res) {
    res.render('signup');
});

app.post('/signup', function(req, res) {
    var user = new db.Users({username: req.body.username, password: req.body.password});
    user.save(function (err, result) {
      if (err) return console.error(err);
      else{
        req.login(user, function(err) {
          if (err) {
            console.log(err);
          }
          return res.redirect('/');
      });
      }
    });
});

app.get('/signin', function(req, res) {
    res.render('signin');
});

app.post('/signin', passport.authenticate('local',{
        failureRedirect: '/signin', 
        failureFlash: true, 
        successRedirect: '/'
    }));

app.get('/signout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/myMessages', function(req, res){
    if (req.session.passport.user == undefined){
      res.redirect('signin');
    }else{
        var query = db.Messages.where({toUser: req.session.passport.user});
        query.find(function (err, messages) {
         var messagesList = [];
         messages.forEach(function(message) {
            messagesList.push("From: " + message.fromUser + ", Message: " + message.message);
        });
        res.render('myMessages', {listMessages: messagesList});
    });
    }   
});

app.get('/sendMessages', function(req, res){
   if (req.session.passport.user == undefined){
      res.redirect('signin');
    }else{
      res.render('sendMessages');
    }   
});

app.post('/sendMessages', function(req, res){
   if (req.session.passport.user == undefined){
      res.redirect('signin');
    }else{
        var message = new db.Messages({fromUser: req.session.passport.user, toUser: req.body.toUser, message: req.body.message });
        message.save(function (err, result) {
          if (err) return console.error(err);
          res.render('messageSent');
        });
    }   
});

app.get('/listUsers', function(req, res){
   var query = db.Users.where({});
   query.find(function (err, users) {
         var userList = [];
         users.forEach(function(user) {
            userList.push(user.username);
        });
        res.render('listUsers', {list: userList});
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
