var fs = require('fs');
var express = require('express');
var router = express.Router();
// node-imgur even though their docs say differently
var imgur = require('imgur');
// file size limits are in bytes; 200 * 1000 * 1000 = 200 mb.
var multer = require('multer');
var upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 200 * 1000 * 1000
  },
  fileFilter: function (req, file, cb) {
    // node: error first callbacks.
    cb(null, file.mimetype.slice(0, 6) === 'image/');
  }
})

router.get('/', function (req, res) {
  res.render('templates/imgur');
})

// file is the form field name where the file was uploaded;
// destination folder is "uploads" as has been specified here.
// 'image' below corresponds to the form field name where the file is.
// req.file refers to the .file object that multer generates for us.

// middleware 'upload' makes the req.file attribute.
router.post('/upload', upload.single('image'), function (req, res) {
  console.log(req.file);
  //middleware function we were running before is returned.
  if (req.file) {
    imgur
      .uploadFile(req.file.path)
      .then(function(json) {
        fs.unlink(req.file.path, function () {
          res.redirect(json.data.link);
        })
      })
      // would only be catching errors, so first argument is gonna be err
      // in Promise.prototype.catch();
      .catch(function(err) {
        console.log(err);
        res.redirect('/imgur');
      })
  } else {
    res.status(415).send('Must upload an image!');
  }
});

module.exports = router;
