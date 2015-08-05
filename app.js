var fs = require('fs');
// none of this seems very different. Apparently express is useful primarily for eliminating all the
// if/else routing statements we had previously.

// could shorten two lines as: var app = require('express')();
// but some part of a pattern that we've used requires express = require('express');
// iirc.

//////// npm requires
var express = require('express');
var lessCSS = require('less-middleware');
// morgan and winston are loggers. Loggly wants us to use winston.
var morgan = require('morgan');
var bodyParser = require('body-parser');
var loggly = require('loggly');

// can split into a bunch of different routers if desired.
// we're gonna do so with the pizza routes.

//////// file requires
var routes = require('./routes/index');
var pizzaRoutes = require('./routes/pizza');
var chickennuggets = require('./routes/chickennuggets');

//////// variables
var app = express();
require('./lib/secrets');

// need to tell node/express about EJS.
//////// settings
app.set('view engine', 'ejs');
// as you would expect:
app.set('case sensitive routing', true);
//app.enable('case sensitive routing');
// trailing slashes make a difference?
app.set('strict routing', true);

// variables that templates will have access to.
app.locals.title = 'My Awesome App';


var logStream = fs.createWriteStream('access.log', {flags: 'a'});
// when you pass in next, that signals for the middleware chain to continue.
// need to execute it too.
//////// middlewares
// less compiler. Compiles and puts in .css as requests to routes come in and request .css
// files (which are in public); compiles the .less file and serves up the compiled .css.
// string put into morgan() will determine output format.
// first writes to the logStream variable (which is a stream going to access.log; flags: a means append
// instead of overwriting the file (or generate new if there isn't one)).
// second outputs to the terminal.
app.use(morgan('combined', {stream: logStream}));
app.use(morgan('dev'));

// var client = loggly.createClient({
//   token: "f08763b3-3e97-465d-842e-f0670ce6ad11",
//   subdomain: "johnwquarles",
//   tags: ['NodeJS'],
//   json: true
// });

// logging to loggly
// could use this only to log errors. Think of use cases.
app.use(function (req, res, next) {
  var client = require('./lib/loggly')('incoming');
  client.log({
    ip: req.ip,
    date: new Date(),
    url: req.url,
    status: res.statusCode,
    method: req.method,
  });
  next();
});

app.use(lessCSS('public'));
// morgan makes better output; had been using code below:
// ------------------------------------------------------
// app.use(function(req, res, next) {
//   console.log('Request at ' + new Date().toISOString());
//   next();
// })
// can also chain these; app.get().get().get() ...
app.use(express.static('public'));

// body-parser is strictly for forms.
app.use(bodyParser.urlencoded({extended: false}))

// routes //
// one pattern that works (pass in app, get it back out):
// require('./routes/index')(app);
//////// routes
app.use('/', routes);
app.use('/pizza', pizzaRoutes);
app.use('/chickennuggets', chickennuggets);

// 403 any other requests
// 400 errors before 500, otherwise the 500 will get triggered first. Or maybe not. But Scott says
// to do so in general.
// undefined routes AREN'T errors because this 403 is here to handle them.
// errors will only occur (and be handled by the 500) if some route executes bad Javascript.
//////// errors
app.use(function (req, res, next) {
  res.status(403).send('Unauthorized');
});

// need to pass 4 arguments so that it knows it's an error-handling middleware.
// if there are 4, the middleware function will *only* fire when there's an error.
app.use(function (err, req, res, next) {
  var client = require('./lib/loggly')('error');

  client.log({
    ip: req.ip,
    date: new Date(),
    url: req.url,
    status: res.statusCode,
    method: req.method,
    stackTrace: err.stack
  });

  console.log('error', err.stack);
  res.status(500).send('I am error.');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  //console.log(process.env["LOGGLY_TOKEN"]);
});
