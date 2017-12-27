var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/control',function (req,res) {
  res.render('home-control',{title: 'Home Control System'});
});

module.exports = router;
