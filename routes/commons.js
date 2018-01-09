var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Member = require('../models/member');
var crypto = require('crypto');
var secret = 'h0M@A<weAre>T0WV0!a#&';


router.get('/signup', function(req, res, next) {
  res.render('commons/signup', { title: 'Sign Up' , msg:''});
});

router.get('/member', function(req, res, next) {
  res.render('commons/add-member', { title: 'Member'});
});

router.post('/member', function (req,res) {
   var member =new Member();
      member.name = req.body.name;
      member.rfid = req.body.rfid;
      member.options = req.body.options;
      member.save(function(err,rtn){
        if(err) throw err;
        res.redirect('/commons/list');
      });
});

router.get('/list', function(req, res) {
    Member.find({},function(err,rtn){
      if(err) throw err;
      res.render('commons/list-member', { title: 'Member List', member : rtn});
    });
});

router.get('/signin', function(req, res, next) {
  res.render('commons/signin', { title: 'Sign In' , msg:'' });
});
router.post('/signup',function (req,res) {
  var user = new User();
   user.name = req.body.name;
   user.email = req.body.email;
   user.address = req.body.address;
   user.phone = req.body.phone;
   user.password = crypto.createHmac('sha256', secret)
                                         .update(req.body.password)
                                         .digest('base64');
   User.findOne({email:user.email},function (err,rtn) {
         if(err) throw err;
         if(rtn != null){
             res.render('commons/signup', { title: 'Sign Up', msg:'Duplicated email!' });
         }else if (req.body.ref_code != "smart") {
           res.render('commons/signup', { title: 'Sign Up', msg:'Ref Code is incorrect !' });
         } else{
           user.save(function (err2,rtn) {
               if(err2) throw err2;
               res.redirect('/commons/signin');
           });
         }
   });
});
router.post('/signin',function (req,res) {
      User.findOne({email:req.body.email},function (err,rtn) {
            if(err) throw err;
            var enc_password = crypto.createHmac('sha256',secret).update(req.body.password).digest('base64');
            if(rtn == null){
              res.render('commons/signin',{title:'Sign In', msg:"Email not found"+req.body.email});
            }else if(rtn.password != enc_password ){
                 res.render('commons/signin',{title:'Sign In', msg:"Password Not Match"});
            }else{

              User.findByIdAndUpdate(rtn._id,{$set:{last_login:new Date()}},function() {
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

router.get('/delete/:id', function (req, res) {
     Member.findByIdAndRemove(req.params.id, function (err, rtn) {
          if(err) throw err;
          res.redirect('/commons/list');
     });

});

module.exports = router;
