const express = require('express');

const router = express.Router();




router.get('/admin/', async (req,res)=>{
    if(!checkSession(req)){return res.render('404');}
    //rendering the page
    
    res.render('admin/index',{'page':'Dashboard'});
  
    
    

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