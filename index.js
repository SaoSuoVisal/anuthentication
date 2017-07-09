var express = require('express');
var exphbs  = require('express-handlebars');
var pg = require('pg');
var db = require('./db');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var needLogin = require('connect-ensure-login').ensureLoggedIn();
// views is directory for all template files

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.users.findById(id, function(err, user){
    if(err){return done(err);}
    done(null, user);
  });
});

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', (process.env.PORT || 5000));

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

/*app.get('/db', function (request, response) {
  pg.connect(process.env.DATA, function(err, client, done) {
    client.query('SELECT * FROM test_table;', function(err, result) {
      done();
      if (err){ console.error(err);}
      else { 
        response.render('login', {results: result.rows} ); 
      }
    });
  });
});*/

app.get('/', function(request, response) {
  response.render('home', {user: request.user});
});

app.get('/register', function(request, response){
  response.render('register');
});


app.get('/login', function(request, response) {
    response.render('login');
});

app.post('/login',
  passport.authenticate('local', 
    { successRedirect: '/',
        failureRedirect: '/login'
    }
  )
);

app.get('/logout', function(request, response){
  request.logout();
  response.redirect('/');
});

app.get('/profile', needLogin,function(request, response){
  console.log("Email: " + request.user.email);
  response.render('profile', {user: request.user});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});