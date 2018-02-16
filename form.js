const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const xss = require('xss');
const sql = require('./sql');

function form(req, res) {
  const data = {};
  const information ={
      name : '',
      email : '',
      ssn : '',
      amount : 0,
    }
  res.render('form', {data, information});
}

router.get('/', form);

router.post('/post',

  // Þetta er bara validation! Ekki sanitization
  check('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
  check('email').isLength({ min: 1}).withMessage('Netfang má ekki vera tómt'),
  check('email').isEmail().withMessage('Netfang verður að vera netfang'),
  check('ssn').isLength({ min: 1 }).withMessage('Kennitala má ekki vera tóm'),
  check('ssn').matches(/^[0-9]{6}-?[0-9]{4}$/).withMessage('Kennitala verður að vera á formi 000000-0000'),

  async (req, res) => {
    const {
      name = '',
      email = '',
      ssn = '',
      amount = 0,
    } = req.body;

    const errors = validationResult(req);
    const details = req.body;
    let errormessages;

    if (!errors.isEmpty()) {
      errormessages = errors.array().map(value => value.msg);
      res.render('form', { error: errormessages, details, user: res.locals.user });
      return res.render('form', { errors: errormessages, details });
  }
	const data = [req.body.nafn, req.body.email, req.body.kennitala, req.body.fjoldi];
    data.map(item => xss(item));
    const result = await sql.insert(data);
    if (result === -1) {
      errormessages = [''];
      res.render('form', { error: errormessages, details, user: res.locals.user });
    } else {
      res.render('thanks');
    }
  },
);


module.exports = router;
