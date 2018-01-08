var express = require('express');
var router = express.Router();
var Status = require('../models/status');


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

router.post('/control/status',function (req,res) {
  Status.findOne({key:'key'},function (err,rtn) {
     if(err) throw err;
     console.log(rtn);
     if(rtn != null) res.json({status: rtn});
    
  });

});

router.get('/status');
module.exports = router;
