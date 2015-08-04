var express = require('express');
// already in subroutes so case sensitivity would apply to subroutes, but they're arbitrary anyway...
// will just leave in here for reference.
var router = express.Router({
  caseSensitive: true
});

// colon variable route syntax here is same as in angular.
// sent to req.params, an object. Which is also like angular.
router.get('/:topping/:qty', function (req, res) {
  var obj = req.params;

  res.render('templates/pizza', obj);
});

module.exports = router;
