//importing functions
const express = require('express');
const router = express.Router();
const categoriesDB = require('../models/categoriesModel');
const coursesDB = require('../models/coursesModel');
let ipp=4;//item per page for allcourse
let page=1;//page number for allcourse
let sortname='date(older first)';//sort method for allcourse
let cid='';//item per page for categoryview
let cipp=4;//category id for categoryview
let cpage=1;// page number for categoryview
let csortname='date(older first)';//sort method for categoryview
let name='';//search name
let sipp=4;//item per page for search
let spage=1;// page number for search
let ssortname='date(older first)';//sort method for search
router.get('/', async (req,res)=>{
    //when requesting home
    ipp=4;
    page=1;
    sortname='date(older first)';
    cipp=4;
    cpage=1;
    csortname='date(older first)';
    sipp=4;
    spage=1;
    ssortname='date(older first)';
    //get categories for drop down list
  let categories = await categoriesDB.listCategoriesMenu();
  //show 20 last added courses
  let courses = await coursesDB.listCoursesOnSite('-date',20,0);
    //rendering the page

    res.render('site/home',{'identity': req.session.user?'logout':'login','categories':categories , 'courses':courses});

});
//sort function to translate sort method to an object that sort method of mongoose can understand
const sort= (str)=>{
if(str==='date(older first)'){
    return 'date';
}
if(str==='date(newer first)'){
    return '-date';
}
if(str==='alphabetical(descending)'){
    return { name: 'descending' };
}
if(str==='alphabetical(ascending)'){
    return { name: 'ascending' };
}
return 'date';
}
router.get('/allcourses', async (req,res)=>{
    cipp=4;
    cpage=1;
    csortname='date(older first)';
    sipp=4;
    spage=1;
    ssortname='date(older first)';
    //x determine the skip value
    let x=(page-1)*ipp;
    let courses = await coursesDB.listCoursesOnSite(sort(sortname),ipp,x);
    let categories = await categoriesDB.listCategoriesMenu();
    //count allcourses pages
    let index = await coursesDB.countAllPages(ipp);
    //fill an array each index with its number 
    let arr=[];
    for(let i=1;i<=index;i++){
        if(i===page){arr.push({'num':i,'active':'disabled'});}
        else{
        arr.push({'num':i,'active':''});}
    }
    res.render('site/allcourses',{'identity':req.session.user?'logout':'login','categories':categories ,'name':'ALL COURSES:-',
    'nums':arr,'ipp':ipp,'courses':courses,'page':page,'sort':sortname});

});
//these gets sets my variables
router.get('/allcourses/items/:num', async (req,res)=>{
   ipp=parseInt(req.params.num);
   res.redirect('/allcourses');

});
router.get('/allcourses/page/:num', async (req,res)=>{
    page=parseInt(req.params.num);
   res.redirect('/allcourses');
});
router.get('/allcourses/sort/:str', async (req,res)=>{
    sortname=req.params.str;
   res.redirect('/allcourses');
});

router.get('/viewCourse/:id', async (req,res)=>{
    let course = await coursesDB.getById(req.params.id);
    let category = await categoriesDB.getById(course.category_id);
    //rendering the page
    let categories = await categoriesDB.listCategoriesMenu();
    res.render('site/viewcourse',{'identity':req.session.user?'logout':'login',
    'name':course.name,'id':course._id,'description':course.description,'category':category.name,'categories':categories,
    'vurl':req.session.user?course.video:'',
    'error':req.session.user?'':'you must LogIn to see video and downlod files'});

});


//same as allcourses
router.get('/viewcategory', async (req,res)=>{
    ipp=4;
    page=1;
    sortname='date(older first)';
    sipp=4;
    spage=1;
    ssortname='date(older first)';

    let x=(cpage-1)*cipp;
    let courses = await coursesDB.listCoursesOnSiteByCategory(cid,sort(csortname),cipp,x);

    let category = await categoriesDB.getById(cid);
    let categories = await categoriesDB.listCategoriesMenu();
    //rendering the page
    let index = await coursesDB.countAllCategoryPages(cid,cipp);
    //fill an array each index with its number 
    let arr=[];
    for(let i=1;i<=index;i++){
        if(i===cpage){arr.push({'num':i,'active':'disabled'});}
        else{
        arr.push({'num':i,'active':''});}
    }
    res.render('site/viewcategory',{'identity':req.session.user?'logout':'login','categories':categories ,'name':category.name,
    'nums':arr,'ipp':cipp,'courses':courses,'page':cpage,'sort':csortname});

});
router.get('/viewcategory/items/:num', async (req,res)=>{
   cipp=parseInt(req.params.num);
  res.redirect('/viewcategory');

});
router.get('/viewcategory/page/:num', async (req,res)=>{
    cpage=parseInt(req.params.num);
   res.redirect('/viewcategory');
});
router.get('/viewcategory/sort/:str', async (req,res)=>{
    csortname=req.params.str;
   res.redirect('/viewcategory');
});
router.get('/viewcategory/:id', async (req,res)=>{
    cid=req.params.id;
   res.redirect('/viewcategory');
});







//same as all courses

router.get('/search', async (req,res)=>{
    ipp=4;
    page=1;
    sortname='date(older first)';
    cipp=4;
    cpage=1;
    csortname='date(older first)';
    let x=(spage-1)*sipp;
    let courses = await coursesDB.listCoursesOnSiteByName(name,sort(ssortname),sipp,x);

    let categories = await categoriesDB.listCategoriesMenu();
    //rendering the page
    let index = await coursesDB.countAllSearchPages(name,sipp);
    //fill an array each index with its number 
    let arr=[];
    for(let i=1;i<=index;i++){
        if(i===spage){arr.push({'num':i,'active':'disabled'});}
        else{
        arr.push({'num':i,'active':''});}
    }
    res.render('site/search',{'identity':req.session.user?'logout':'login','categories':categories ,'name':name,
    'nums':arr,'ipp':sipp,'courses':courses,'page':spage,'sort':ssortname});

});
router.get('/search/items/:num', async (req,res)=>{
   sipp=parseInt(req.params.num);
  res.redirect('/search');

});
router.get('/search/page/:num', async (req,res)=>{
    spage=parseInt(req.params.num);
    
   res.redirect('/search');
});
router.get('/search/sort/:str', async (req,res)=>{
    ssortname=req.params.str;
   res.redirect('/search');
});
router.post('/search', async (req,res)=>{
    name=req.body.name;
    
   res.redirect('/search');
});


module.exports = router;
