//importing functions
const express = require('express');
const router = express.Router();
const db= require('../models/categoriesModel');
const { body, validationResult } = require('express-validator');
const coursesDB=require('../models/coursesModel');

router.get('/admin/categories', async (req,res)=>{//if admin session does not exist return 404 page
    if(!checkSession(req)){return res.render('404');}
    list = await db.listCategories();
    //rendering the page
    
    res.render('admin/categories/index',{'page':'Categories', 'categories':list});

});

router.get('/category/add', async (req,res)=>{
    if(!checkSession(req)){return res.render('404');}
    //rendering the page
    
    res.render('admin/categories/add',{'page':'Add New Category'});

});
router.post('/category/add',
async (req,res)=>{ if(!checkSession(req)){return res.render('404');}
    
let newname = (req.body.name).replace(/(<[^>]+>)+/g, " ");

   await db.addCategory(newname,req.body.enabled?true:false);
    //rendering the page
    
    res.redirect('/admin/categories');
    
});


router.get('/category/edit/:id',async (req,res)=>{
    if(!checkSession(req)){return res.render('404');}
    let category= await db.getById(req.params.id);
    x=category.enabled?'checked':'';
    
    res.render('admin/categories/edit',{'page':'Add New Category','name':category.name,'enabled':x,'id':category._id});

});
router.get('/category/delete/:id', async (req,res)=>{
    if(!checkSession(req)){return res.render('404');}//if category has course cant be deleted
   let courses=await coursesDB.getByCategoryId(req.params.id);

    //rendering the page
    if(courses[0]){
        list = await db.listCategories();
    //rendering the page
    let errors=[{
        "msg":" cant delete category that has a course"
    }];
    
    res.render('admin/categories/index',{'page':'Categories', 'categories':list,'error':errors});
    return;
    }
   await db.deleteCategory(req.params.id);

   res.redirect('/admin/categories');

});
router.post('/category/edit/:id',async (req,res)=>{ if(!checkSession(req)){return res.render('404');}
   
let newname = (req.body.name).replace(/(<[^>]+>)+/g, " ");


   await db.updateCategory(req.params.id,newname,req.body.enabled?true:false);
    //rendering the page
    
    res.redirect('/admin/categories');

});
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