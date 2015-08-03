// none of this seems very different. Apparently express is useful primarily for eliminating all the
// if/else routing statements we had previously.

// could shorten next two lines as: var app = require('express')();
var express = require('express');
var app = express();

// need to tell node/express about EJS.
app.set('view engine', 'ejs');

// when you pass in next, that signals for the middleware chain to continue.
// need to execute it too.
app.use(function(req, res, next) {
  console.log('Request at ' + new Date().toISOString());
  next();
})

// can also chain these; app.get().get().get() ...
app.use(express.static('public'));

// order matters when defining routes!
// res.send is express; changes content type based on the text that it sees.
// ie, automatically. Also ends the response.
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// can use regex
app.get(/^hello$/, function (req, res) {
  res.send('Hello!');
});

app.get('/awesomethings', function (req, res) {
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
    res.render('templates/world', { title: 'Awesomesite.com', welcome: 'Thanks for coming!', awesomeThings: awesomeThings});
  }, 5000)
});

// throws error but does not crash server.
app.get('/thisshoulderror', function(req, res) {
  res.send(badVariable);
});

// 403 any other requests
// 400 errors before 500, otherwise the 500 will get triggered first. Or maybe not. But Scott says
// to do so in general.
// undefined routes AREN'T errors because this 403 is here to handle them.
// errors will only occur (and be handled by the 500) if some route executes bad Javascript.
app.use(function (req, res, next) {
  res.status(403).send('Unauthorized');
});

// need to pass 4 arguments so that it knows it's an error-handling middleware.
// if there are 4, the middleware function will *only* fire when there's an error.
app.use(function (err, req, res, next) {
  console.log('error', err.stack);
  res.status(500).send('I am error.');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
