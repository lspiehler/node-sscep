var express = require('express');
var router = express.Router();
var sscep = require('../lib/scep');

/* GET home page. */
router.get('/yo', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/test', function(req, res, next) {
  console.log(req.body);
  sscep.GetCA({url: 'http://cyopki.com/scep/ToMdakJVdr'}, function(err, scep) {
    if(err) {
      console.log(err);
    } else {
      console.log(scep);
    }
  });
  res.json(req.body);
  //res.render('index', { title: 'Express' });
});

module.exports = router;
