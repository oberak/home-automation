var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/control',function (req,res) {

  if(req.session.user){
    res.render('home-control',{title: 'Home Control System'});
  }else {
    res.redirect('/commons/signin');
  }
});



module.exports = router;
