var mongo = require('mongodb').MongoClient;

var url = process.env.MONGODB_URL;
// MongoClient is an object with a function connect.

// the below is async, so do this, and then pass in a cb function that will bring us back the data when we use
// the exported function.
// (could do it this way; we moved away from it).

// module.exports = function(cb) {
//   mongo.connect('mongodb://localhost:27017/express_basics', cb);
// }

// don't need to export because this is setting a global (and that's it); just need the code to run.
// global is the same for the app and for whatever other Javascript is gonna run it.
if (!global.db) {
  // BELOW MUST MUST MUST BE NAME OF THE DB THAT YOU'RE USING
  // which is pretty obvious, granted.
  mongo.connect(url, function(err, db) {
    global.db = db;
  });
}
