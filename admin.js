const express = require('express');
const csv = require('express-csv');
const sql = require('./sql');

const router = express.Router();

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

async function admin(req, res) {
  const list = await sql.select().catch(err => console.error(err));
  res.render('admin', { list, user: res.locals.user });
}

async function csvhandler(req, res) {
  const result = await sql.select().catch((err) => {
    console.error(item);
  });

  const table = [['id', 'date', 'nafn', 'email', 'kennitala', 'fjoldi']];
  result.forEach((item) => {
    table.push([item.id, item.date, item.nafn, item.email, item.kennitala, item.fjoldi]);
  });
  res.setHeader('Content-Disposition', 'attachment; filename=table.csv');
  res.csv(table);
}

router.get('/', ensureLoggedIn, admin);
router.get('/csv', ensureLoggedIn, csvhandler);

module.exports = router;