const path = require('path');
const express = require('express');
const session = require('express-session');
const form = require('./form');
const admin = require('./admin');
const passport = require('passport');
const { Strategy } = require('passport-local');
const users = require('./users');

const sessionSecret = 'leyndarmál';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

function strat(username, password, done) {
  users
    .findByUsername(username)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }

      return users.comparePasswords(password, user);
    })
    .then(res => done(null, res))
    .catch((err) => {
      done(err);
    });
}

passport.use(new Strategy(strat));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  users
    .findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

app.use(passport.initialize()); // passport keyrir sig upp og býr til middleware
app.use(passport.session()); // session til að geyma

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', form);
app.use('/admin', admin);

app.get('/login', (req, res) => {
  const linkInnskra = true;
  res.render('login', { linkInnskra });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).render('error', { title: '404' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);
  res.status(500).render('error', { err });
}

app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/');
  },
);

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});