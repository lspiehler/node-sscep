var express = require('express');
var router = express.Router();
var sscep = require('../lib/scep');

/* GET home page. */
router.get('/yo', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/scep', function(req, res, next) {
  console.log(req.body);
  sscep.GetCA({url: req.body.url, csr: req.body.csr, key: req.body.key, }, function(err, scep) {
    if(err) {
      console.log(err);
      console.log(scep);
      res.json(err);
    } else {
      console.log(scep);
      res.json(scep);
    }
  });
  //res.render('index', { title: 'Express' });
});

module.exports = router;
