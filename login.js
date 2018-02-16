const express = require('express');

const router = express();
const pug = require('pug');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { Strategy } = require('passport-local');
/* todo */

const sessionSecret = 'leyndarmál';


router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));
router.use(session({
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

router.use(passport.initialize());
router.use(passport.session());

router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    // getum núna notað user í viewum
    res.locals.user = req.user;
  }

  next();
});

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.send(`
      <p>Innskráning sem ${req.user.username}</p>
      <p><a href="/logout">Útskráning</a></p>
    `);
  }

  return res.render('login');
  });

router.get('/login', (req, res) => {
  res.render('/login')
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/admin');
  },
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


module.exports = router;