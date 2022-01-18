// importing express
const express = require('express');
const session = require('express-session')
const fileUpload = require('express-fileupload');
//importing view engin hbs
const hbs = require('hbs');
//importing path library to help getting project directory
const path = require('path');
//importing mongo db model


// setting directories paths
const viewsDir  = path.join(__dirname,'../views');
const publicDir = path.join(__dirname,'../public');
const partialsDir = path.join(__dirname,'../views/partials');
//initializing the main router
const app = express();
//need that to get values from post request because body parser is deprecated
app.use(express.urlencoded({extended:false}));
app.use(fileUpload());
//configuring our router with project
app.use(express.static(publicDir));
app.set('view engine','hbs');
app.set('views',viewsDir);
hbs.registerPartials(partialsDir);
//that function slice date instance and return a string yyyy-mm-dd h:m:s

// to make a function that i cant use in my hbs files
//this function if string is bigger than 50 char it slice it and add ... to it and return it

hbs.registerHelper('length', function(content) {
    if(content.length>50){
        let str=content;
        str=str.slice(0,50);
        str+="...";
        return (str);
    }
    return (content);
});
// to now wich category is selected in course edit
   hbs.registerHelper('is_selected', function(arr,cid) {
       arr.forEach(obj => {
        
        if((obj._id).toString()===cid){
            obj.selected = 'selected';
          
        }
        else{obj.selected='';}
       });
  

  

});
//initializing my session
app.use(session({
  
    // It holds the secret key for session
    secret: 'Your_Secret_Key',
  
    // Forces the session to be saved
    // back to the session store
    resave: true,
  
    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}));
   



//adding my routers to main router
app.use('/',require('../router/site'));
app.use('/',require('../router/auth'));
app.use('/',require('../router/dashboard'));
app.use('/',require('../router/users'));
app.use('/',require('../router/categories'));
app.use('/',require('../router/courses'));
app.get('/download/:id', async (req,res)=>{
    let file = path.join(publicDir, '/docs/'+req.params.id+'.pdf'); 
    res.download(file, function (err) {
        if (err) {
            console.log("Error");
            console.log(err);
        } else {
            console.log("Success");
        }    });
});
// if any requested domain does not exist return 404
app.get('*',(req,res)=>{
    return res.render('404');
})


//starting the server
app.listen(3000,()=>{
   console.log('Server started on port 3000'); 
});