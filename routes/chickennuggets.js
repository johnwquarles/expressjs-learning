var express = require('express');
var moment = require('moment');
var ObjectId = require('mongodb').ObjectID;

var router = express.Router();

function getFormattedChicken(completedOrNot, cb){
  var collection = global.db.collection('chickennuggets');
  collection.find({complete: {$exists: completedOrNot}}).toArray(function (err, orders) {
    var formattedOrders = orders.map(function (order) {
      return {
        _id: order._id,
        name: order.name,
        flavor: order.sauce,
        qty: order.qty,
        createdAt: moment(order._id.getTimestamp()).fromNow(),
        completedOrNot: completedOrNot
      };
    });
    cb(formattedOrders);
  });
};

router.get('/', function(req, res) {
  getFormattedChicken(false, function(formattedOrders) {
    res.render('templates/chicken-index', {orders: formattedOrders});
  });
});

router.get('/finished', function(req, res) {
  getFormattedChicken(true, function(formattedOrders) {
    res.render('templates/chicken-index', {orders: formattedOrders});
  });
});

// // make the below route an index of all the orders.
// router.get('/', function(req, res) {
//   // these need to happen inside the callback
//   var collection = global.db.collection('chickennuggets');
//   collection.find({"complete": {$exists: false}}).toArray(function (err, orders) {
//     var formattedOrders = orders.map(function (order) {
//       return {
//         _id: order._id,
//         name: order.name,
//         flavor: order.style,
//         qty: order.qty,
//         createdAt: moment(order._id.getTimestamp()).fromNow()
//       };
//     });
//     // below part (render) needs to be in the callback from the database
//     // s.t. the data is available.
//     res.render('templates/chicken-index', {orders: formattedOrders});
//   });
// });

router.get('/order', function(req, res) {
  res.render('templates/chicken-new');
});

// making this a post request for semantic reasons; doesn't involve forms; could be get.
// but usage of this verb is to indicate that the action taken on this route will have a side effect;
// (if you were to get a url over and over, you should always be getting the same thing.)

// I take all that back; Scott just made the link (was a href) into a form; needs to be post now.
router.post('/order', function(req, res) {
  var collection = global.db.collection('chickennuggets');
  // write req.body (the order, as parsed by body-parser) to the database
  // which will then be looped over in the chicken-index.
  collection.save(req.body, function() {
    // redirect works from root; doesn't know that you're subrouted.
    res.redirect('/chickennuggets');
  });

//   // I think that req.body is structured the way it is (as an object) because
//   // of app.use(bodyParser.urlencoded({extended: false})) in app.js
//   console.log(req.body);
//   res.redirect('/');

});

router.post('/order/:id/complete', function (req, res) {
  var collection = global.db.collection('chickennuggets');

  collection.update(
      // if the object's _id is something that mongodb auto-generated, it (the ID) is an object!
      // which is not the same thing as the string representation of that object; those would be different ids.
      // so if we have an objectID object as the ID of an entry but we search by req.params.id, we won't find what we want.
      // must generate the object FROM its string representation via ObjectId (from var ObjectId = require('mongodb').ObjectID; above)
      {_id: ObjectId(req.params.id)},
      {$set: {complete: true}},
      function () {
        res.redirect('/chickennuggets')
      }
  );
});

module.exports = router;
