const express = require('express');
const db= require('../models/usersModel');
const md5 = require('md5');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');



router.get('/admin/users/', async (req,res)=>{if(!checkSession(req)){return res.render('404');}
   
    //rendering the page
    list = await db.listUsers(false);
    
    res.render('admin/users/index',{'page':'Active Users','users':list});

});
router.get('/admin/users/pended', async (req,res)=>{if(!checkSession(req)){return res.render('404');}
   
    list = await db.listUsers(true);

    //rendering the page
    
    res.render('admin/users/pended',{'page':'Pended Users','users':list});

});
router.get('/user/delete/:id', async (req,res)=>{if(!checkSession(req)){return res.render('404');}
    let id=req.params.id;
    db.deleteUser(id);
   
     res.redirect('/admin/users/')

});
router.get('/user/edit/:id', async (req,res)=>{if(!checkSession(req)){return res.render('404');}
    let id=req.params.id;
    let user=await db.getById(id);
    let x;
    x=user.suspended?'checked':'';
     res.render('admin/users/edit',{'id':user._id,'fname':user.Fname,'lname':user.Lname,'email':user.email,'suspended':x});

});
router.post('/user/add',

body('fname').isAlpha(),
body('lname').isAlpha(),
body('email').isEmail(),
body('password').isLength({ min: 8 }),
body('password').isAlphanumeric(),
body('email').custom(value => {
  return db.emailValidate(value).then(user => {
    if (user) {
      return Promise.reject('E-mail already in use');
    }
  });
}),
body('cpassword').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }

  // Indicates the success of this synchronous custom validator
  return true;
}),
 async (req,res)=>{if(!checkSession(req)){return res.render('404');}
    let errors = validationResult(req);

    if(!errors.isEmpty()){

      return res.render('admin/users/add',{'page':'Add User','error':errors.array()});
     

    }
    db.addUser(req.body.fname,req.body.lname,req.body.email,md5(req.body.password),req.body.suspended?true:false,false);
     res.redirect('/admin/users')

});

router.get('/user/accept/:id', async (req,res)=>{if(!checkSession(req)){return res.render('404');}
let user=await db.getById(req.params.id);
    sendEmail(user.email)
    db.acceptUser(req.params.id);
    
     res.redirect('/admin/users/pended')
     

});


router.post('/user/edit/:id',

body('fname').isAlpha(),
body('lname').isAlpha(),
body('email').isEmail(),
body('password').isLength({ min: 8 }),
body('password').isAlphanumeric(),
body('email').custom((value, { req }) => {
  return db.emailValidate(value).then(user => {
    if (user && (user._id).toString() !==req.params.id) {
      return Promise.reject('E-mail already in use');
    }
  });
}),
body('cpassword').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }

  // Indicates the success of this synchronous custom validator
  return true;
}),
async (req,res)=>{
    if(!checkSession(req)){return res.render('404');}
    let errors = validationResult(req);
    if(!errors.isEmpty()){
      let id=req.params.id;
      let user=await db.getById(id);
      let x;
      x=user.suspended?'checked':'';
       return res.render('admin/users/edit',{'id':user._id,'fname':user.Fname,'lname':user.Lname,'email':user.email,'suspended':x,'error':errors.array()});
    
    }
    await db.updateUser(req.params.id,req.body.fname,req.body.lname,req.body.email,md5(req.body.password),req.body.suspended?true:false,false);
     res.redirect('/admin/users')

});

router.get('/user/add', async (req,res)=>{
  if(!checkSession(req)){return res.render('404');}
  //rendering the page
  
  res.render('admin/users/add',{'page':'Add User'});

});


const sendEmail=(email)=>{
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'elearning2021a@gmail.com',
          pass: '123elearning'
        }
      });
      
      let mailOptions = {
        from: 'elearning2021a@gmail.com',
        to: email,
        subject: 'account approved',
        text: 'Thanks for registering'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return false;
        } else {
          console.log('Email sent: ' + info.response);
          return true;
        }
      });
  }

  let checkSession = (req)=>{
      if(!req.session.user){
          return false;
      }
      else{
          if(req.session.user.admin){
              return true;
          }
          return false;
      }
  }
module.exports = router;