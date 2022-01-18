const express = require('express');
//initalizing my router
const router = express.Router();
//importing express validator functions
const { body, validationResult } = require('express-validator');
//importing user model
const db= require('../models/usersModel');
//importing md5 to hash passwords
const md5 = require('md5');

router.get('/login', async (req,res)=>{
   
    //rendering the page
   
    res.render('auth/login');

});
router.get('/logout', async (req,res)=>{
   
    //rendering the page
    req.session.destroy(function(error){
        console.log("Session Destroyed")
    });
    res.redirect('/');

});

router.get('/register', async (req,res)=>{
   
    //rendering the page
    
    res.render('auth/register');

});

router.post('/login',
//using express validator in my req.body feilds
body('email').isEmail(),
body('password').isLength({ min: 8 }),
body('password').isAlphanumeric(),
body('email').custom((value, { req }) => {//chech if email is correct
  return db.getByEmailAndPassword(value, md5(req.body.password)).then(user => {
    if (!user) {
      return Promise.reject('wrong email or password');
    }
  });
}),
 async (req,res)=>{
    let errors = validationResult(req);
    //if there is an error in validation return it
    if(!errors.isEmpty()){

        return res.render('auth/login',{'error':errors.array()});
       
  
      }
    //rendering the page
   user=await db.getByEmailAndPassword(req.body.email, md5(req.body.password));
   
   
       
    req.session.user=user;
    if(user.admin){//if user is admin redirect to admin dashboard else redirect to main site
      res.redirect('/admin/')}
    else{res.redirect('/')}


});

router.post('/register', 

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
async (req,res)=>{
    let errors = validationResult(req);

    if(!errors.isEmpty()){

      return res.render('auth/register',{'error':errors.array()});
     

    }
    //rendering the page
  
    db.addUser(req.body.fname,req.body.lname,req.body.email, md5(req.body.password),false,true);
    res.render('auth/thanks');

});

module.exports = router;