var express = require('express');
var router = express.Router();
var Common = require('../models/common');
var crypto = require('crypto');
var secret = 'h0M@A<weAre>T0WV0!a#&';


router.get('/signup', function(req, res, next) {
  res.render('commons/signup', { title: 'Sign Up' , msg:''});
});

router.get('/signin', function(req, res, next) {
  res.render('commons/signin', { title: 'Sign In' , msg:'' });
});
router.post('/signup',function (req,res) {
  var common = new Common();
   common.name = req.body.name;
   common.email = req.body.email;
   common.address = req.body.address;
   common.phone = req.body.phone;
   common.password = crypto.createHmac('sha256', secret)
                                         .update(req.body.password)
                                         .digest('base64');
   Common.findOne({email:common.email},function (err,rtn) {
         if(err) throw err;
         if(rtn != null){
             res.render('commons/signup', { title: 'Sign Up', msg:'Duplicated email!' });
         }else if (req.body.ref_code != "smart") {
           res.render('commons/signup', { title: 'Sign Up', msg:'Ref Code is incorrect !' });
         } else{
           common.save(function (err2,rtn) {
               if(err2) throw err2;
               res.redirect('/commons/signin');
           });
         }
   });
});
router.post('/signin',function (req,res) {
      Common.findOne({email:req.body.email},function (err,rtn) {
            if(err) throw err;
            var enc_password = crypto.createHmac('sha256',secret).update(req.body.password).digest('base64');
            if(rtn == null){
              res.render('commons/signin',{title:'Sign In', msg:"Email not found"+req.body.email});
            }else if(rtn.password != enc_password ){
                 res.render('commons/signin',{title:'Sign In', msg:"Password Not Match"});
            }else{

              Common.findByIdAndUpdate(rtn._id,{$set:{last_login:new Date()}},function() {
                req.session.user = {name:rtn.name, email:rtn.email, _id:rtn._id};
                res.redirect('/control');
              });
            }
      });
});
router.get('/signout', function(req, res, next) {
      req.session.destroy();
      res.redirect('/');
});
module.exports = router;
