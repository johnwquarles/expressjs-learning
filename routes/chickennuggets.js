var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('templates/chickennuggets');
});

router.post('/order', function(req, res) {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
