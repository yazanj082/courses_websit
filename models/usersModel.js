//importing mongoose
const mongoose = require('mongoose');
//connecting to my db and collection
mongoose.connect('mongodb://localhost:27017/elearningDB', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  //making my documents schema
  const userSchema={
    Fname:String,
    Lname:String,
    email:String,
    password:String,
    suspended:Boolean,
    pended:Boolean,
    admin:Boolean,
    
}
const User = mongoose.model('User',userSchema);
module.exports = {
    //to add new user
      addUser : (Fname , Lname,email,password,suspended,pended)=>{
 

  const newUser = new User({
    Fname:Fname,
    Lname:Lname,
    email:email,
    password:password,
    suspended:suspended,
    pended:pended,
    admin:false,
    
    });
    newUser.save();
  },
  //list users based on their state pended or not
  listUsers : async (pended)=>{
    try {
        const list = await User.find().where('pended')
        .equals(pended);
    return list;
    } catch (err) {
        console.error(err.message);
    }
    
    
},
//delete user by id
deleteUser : async (id)=>{
  try {
      await User.findByIdAndDelete(id);
  } catch (err) {
      console.error(err.message);
  }
},
//get user by id
getById : async (id)=>{
  try {
    let user = await User.findById(id);
    
  return user;
} catch (err) {
    console.error(err.message);
}
},
//switch state of pended from true to false
acceptUser :async (id)=>{
  try {
     await User.findByIdAndUpdate(id,{pended:false});
     
    
  
} catch (err) {
    console.error(err.message);
}
},
//update existing user data
updateUser :async (id,Fname , Lname,email,password,suspended,pended)=>{
 

   await User.findByIdAndUpdate(id,{
    Fname:Fname,
    Lname:Lname,
    email:email,
    password:password,
    suspended:suspended,
    pended:pended,
    admin:false,
    
    });
    
  },
  //getting user to login
  getByEmailAndPassword:async (email,pass)=>{
    try {
      let user = await User.findOne({'email':email,'password':pass});
      
      
      if(user){
      if(user.pended || user.suspended ){
        return null;
        
      }
      return user;
    }else{return null}
      
    
  } catch (err) {
      console.error(err.message);
  }
  },
  //check if email exist or not
  emailValidate:async (email)=>{
    try {
      let user = await User.findOne({'email':email});
      
      
      
      return user;
    
      
    
  } catch (err) {
      console.error(err.message);
  }
  },
}
