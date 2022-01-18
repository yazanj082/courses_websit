//importing functions
const express = require('express');
const router = express.Router();
const categoriesDB=require('../models/categoriesModel');
const coursesDB=require('../models/coursesModel');
const path = require('path');
const publicDir = path.join(__dirname,'../public');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
//checking admin session
router.get('/admin/courses', async (req,res)=>{if(!checkSession(req)){return res.render('404');}
   
    //rendering the page
   let list=await coursesDB.listCourses();
    res.render('admin/courses/index',{'page':'Courses',"courses":list});

});


router.get('/course/add', async (req,res)=>{if(!checkSession(req)){return res.render('404');}
   
    //rendering the page
    let list =await categoriesDB.listCategories();
    
    res.render('admin/courses/add',{'page':'Add New Course','categories':list});

});

router.post('/course/add',

  body('vurl').custom((value) => {// validating youtube url
    return value.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);
  }),
   async (req,res)=>{if(!checkSession(req)){return res.render('404');}
   
    //rendering the page
    let image=null;
    let pdf=null;
     //checking if post has a files in it

     if(req.files){  image=req.files.image;
     
     pdf=req.files.pdf;}
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        let list =await categoriesDB.listCategories();
    
        res.render('admin/courses/add',{'page':'Add New Course','categories':list,'error':errors.array()});
    
        return;
    }//image and pdf are required
    if(! image || !pdf ){
        let list =await categoriesDB.listCategories();
        errors=[{'msg':'you should upload the files','param':''}]
        res.render('admin/courses/add',{'page':'Add New Course','categories':list,'error':errors});
    
        return;

    }//getting image and pdf extintions to chech if its allowed extention
    let iext=(image.name).split('.')[1];
    let dext=(pdf.name).split('.')[1];
    
   
    if(iext!=='png'&&iext!=='jpeg'&&iext!=='jpg'||dext!=='pdf'){
        let list =await categoriesDB.listCategories();
        errors=[{'msg':'wrong files extention','param':''}];
        res.render('admin/courses/add',{'page':'Add New Course','categories':list,'error':errors});
    
        return;
    }//change video url to play in iframe
    str=(req.body.vurl).replace('watch?v=', 'embed/');
    str=str.split('&')[0];
    let newname = (req.body.name).replace(/(<[^>]+>)+/g, " ");
    let newdesc = (req.body.description).replace(/(<[^>]+>)+/g, " ");

    let course=await coursesDB.addCourse(newname,newdesc,str,req.body.category_id,req.body.enabled?true:false);
    image.name=course.id+'.png';
   
    image.mv(publicDir+'/images/'+image.name)
    pdf.name=course.id+'.pdf';
    pdf.mv(publicDir+'/docs/'+pdf.name)
    res.redirect('/admin/courses');

});

router.get('/course/delete/:id', async (req,res)=>{if(!checkSession(req)){return res.render('404');}
 let id=req.params.id;
    //rendering the page
    await coursesDB.deleteCourse(id);//when deleting a course its files also will be deleted
    fs.unlink(publicDir+'/docs/'+id+'.pdf', (err) => {
        if (err) {
            console.log(err);
        }
    
        console.log("File is deleted.");
    });
    fs.unlink(publicDir+'/images/'+id+'.png', (err) => {
        if (err) {
            console.log(err);
        }
    
        console.log("File is deleted.");
    });
    res.redirect('/admin/courses');

});
// same as add only diffrence is you dont have to upload new image or pdf
router.post('/course/edit/:id',

  body('vurl').custom((value) => {
    return value.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);
  }),
   async (req,res)=>{if(!checkSession(req)){return res.render('404');}
   let image=null;
   let pdf=null;
    //rendering the page
    if(req.files){  image=req.files.image;
    
    pdf=req.files.pdf;}
   
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        let list =await categoriesDB.listCategories();
        let course = await coursesDB.getById(req.params.id);
        x=course.enabled?'checked':'';
        return res.render('admin/courses/edit',{'id':course._id,'error':errors.array(),'page':'Edit Course','categories':list,'name':course.name,'description':course.description,'category_id':course.category_id,'vurl':course.video,'enabled':x});
        
    }
 
    if(image){console.log('image');
        let iext=(image.name).split('.')[1];
        if(iext!=='png'&&iext!=='jpeg'&&iext!=='jpg'){
            let list =await categoriesDB.listCategories();
            errors=[{'msg':'wrong files extention','param':''}];
            res.render('admin/courses/add',{'page':'Add New Course','categories':list,'error':errors});
        
            return;
        }
        
        image.name=req.params.id+'.png';
        image.mv(publicDir+'/images/'+image.name)
      
 
    }
    if(pdf){console.log('pdf');
        let dext=(pdf.name).split('.')[1];
        if(dext!=='pdf'){
            let list =await categoriesDB.listCategories();
            errors=[{'msg':'wrong files extention','param':''}];
            res.render('admin/courses/add',{'page':'Add New Course','categories':list,'error':errors});
        
            return;
        }
        
        pdf.name=req.params.id+'.pdf';
        pdf.mv(publicDir+'/docs/'+pdf.name)
       
 
    }
    str=(req.body.vurl).replace('watch?v=', 'embed/');
    str=str.split('&')[0];
    let newname = (req.body.name).replace(/(<[^>]+>)+/g, " ");
    let newdesc = (req.body.description).replace(/(<[^>]+>)+/g, " ");
    await coursesDB.updateCourse(req.params.id,newname,newdesc,str,req.body.category_id,req.body.enabled?true:false);
   
   
    res.redirect('/admin/courses');
    return;

});

router.get('/course/edit/:id', async (req,res)=>{if(!checkSession(req)){return res.render('404');}
    let list =await categoriesDB.listCategories();
    let course = await coursesDB.getById(req.params.id);
    //to determine state of radio button
    x=course.enabled?'checked':'';
    
    return res.render('admin/courses/edit',{'id':course._id,'page':'Edit Course','categories':list,'name':course.name,'description':course.description,'category_id':course.category_id,'vurl':course.video,'enabled':x});
    
    
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