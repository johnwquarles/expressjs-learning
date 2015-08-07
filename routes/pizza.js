var express = require('express');
var moment = require('moment');
var ObjectId = require('mongodb').ObjectID;
// already in subroutes so case sensitivity would apply to subroutes, but they're arbitrary anyway...
// will just leave in here for reference.
var router = express.Router();

function getFormattedPizza(completedOrNot, cb) {
  var collection = global.db.collection('pizza');
  collection.find({complete: {$exists: completedOrNot}}).toArray(function(err, orders) {
    var formattedOrders = orders.map(function(order) {
      return {
        _id: order._id,
        name: order.name,
        topping: order.topping,
        qty: order.qty,
        createdAt: moment(order._id.getTimestamp()).fromNow(),
        completedOrNot: completedOrNot
      };
    });
    cb(formattedOrders);
  });
};

router.get('/', function(req, res) {
  getFormattedPizza(false, function(formattedOrders) {
    res.render('templates/pizza-index', {orders: formattedOrders})
  });
});

router.get('/finished', function(req, res) {
  getFormattedPizza(true, function(formattedOrders) {
    res.render('templates/pizza-index', {orders: formattedOrders})
  });
});

router.get('/order', function(req, res) {
  res.render('templates/pizza-new');
});

router.post('/order', function(req, res) {
  var collection = global.db.collection('pizza');
  collection.save(req.body, function() {
    res.redirect('/pizza');
  });
});

router.post('/order/:id/complete', function(req, res) {
  var collection = global.db.collection('pizza');

  collection.update(
    {_id: ObjectId(req.params.id)},
    {$set: {complete: true}},
    function() {
      res.redirect('/pizza');
    }
  );
});

// colon variable route syntax here is same as in angular.
// sent to req.params, an object. Which is also like angular.
// router.get('/:topping/:qty', function (req, res) {
//   var obj = req.params;

//   res.render('templates/pizza', obj);
// });

// router.get('/', function(req, res) {
//   console.log(req.query);
//   var obj = {
//     qty: req.query.qty || 1,
//     topping: req.query.topping || 'cheese'
//   };
//   res.render('templates/pizza', obj);
// })



module.exports = router;
