var express = require('express');
var router = express.Router();

// order matters when defining routes!
// res.send is express; changes content type based on the text that it sees.
// ie, automatically. Also ends the response.
router.get('/', function (req, res) {
  res.send('Hello World!');
});

// can use regex
router.get(/^hello$/, function (req, res) {
  res.send('Hello!');
});

router.get('/awesomethings', function (req, res) {
  // setTimeout is to show that the page will be rendered when it has everything ready.
  // (don't need to think about it).
  setTimeout(function() {
    var awesomeThings = [
      'Pizza',
      'Bacon',
      'Freedom of the Press',
      'Pluto'
    ];

    // can't have a forward slash before a file path. *Can* if it's a URL string (and normally will).
    // this is a big point please remember it.
    res.render('templates/world', { welcome: 'Thanks for coming!', awesomeThings: awesomeThings});
  }, 5000)
});

// throws error but does not crash server.
router.get('/thisshoulderror', function(req, res) {
  res.send(badVariable);
});

module.exports = router;
