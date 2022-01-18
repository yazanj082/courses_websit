const mongoose = require('mongoose');
//connecting to my db and collection
mongoose.connect('mongodb://localhost:27017/elearningDB', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  //making my documents schema
  const courseSchema={
    name:String,
    description:String,
    video:String,
    category_id:String,
    enabled:Boolean,
    date:Date,
    
}
const Course = mongoose.model('Course',courseSchema);
module.exports = {
    //to add new course
      addCourse :async (name ,description,video,category_id,enabled)=>{
        const newCourse = new Course({
           name:name,
           description:description,
           video:video,
           category_id:category_id,
           enabled:enabled,
           date: Date.now(),
            });
            await newCourse.save();
            return(newCourse);
      },
      //update existing course
      updateCourse : async(id,name ,description,video,category_id,enabled)=>{
        const course =  await Course.findById(id);
            course.name=name;
            course.description=description;
            course.video=video,
            course.category_id=category_id,
            course.enabled=enabled;
            course.save();
      },
      //list all courses
      listCourses : async ()=>{
        try {
            const list = await Course.find();
        return list;
        } catch (err) {
            console.error(err.message);
        }
        
        
    },
    //get course by id
    getById : async (id)=>{
        try {
            const course = await Course.findById(id);
        return course;
        } catch (err) {
            console.error(err.message);
        }
        
        
    },
    //delete a course from collection
deleteCourse : async (id)=>{
    try {
        await Course.findByIdAndDelete(id);
    } catch (err) {
        console.error(err.message);
    }
  },
  //get a course using category_id feild
  getByCategoryId : async (id)=>{
    try {
        const course = await Course.find().where("category_id").equals(id);
    return course;
    } catch (err) {
        console.error(err.message);
    }
    
    
},
//list enabled courses on site

listCoursesOnSite : async (str,limit,index)=>{
    try {
        const list = await Course.find().sort(str).limit(limit).skip(index).where('enabled').equals(true);
    return list;
    } catch (err) {
        console.error(err.message);
    }
    
    
},
//count pages for all enabled courses
countAllPages : async (iip)=>{
    try {let count = await Course.find({'enabled':true}).countDocuments();
    return Math.ceil(count/iip);
        
    } catch (err) {
      console.error(err.message);
    }
  
  
},
// get courses based on category id
listCoursesOnSiteByCategory : async (id,str,limit,index)=>{
    try {
        const list = await Course.find({'enabled':true,'category_id':id}).sort(str).limit(limit).skip(index);
    return list;
    } catch (err) {
        console.error(err.message);
    }
    
    
},
//count pages for name category courses
countAllCategoryPages : async (id,iip)=>{
    try {let count = await Course.find({'enabled':true,'category_id':id}).countDocuments();
    return Math.ceil(count/iip);
        
    } catch (err) {
      console.error(err.message);
    }
  
  
},
//list courses for search
listCoursesOnSiteByName : async (name,str,limit,index)=>{
    try {
        const list = await Course.find({'enabled':true,'name': new RegExp(name, "i")}).sort(str).limit(limit).skip(index);
    return list;
    } catch (err) {
        console.error(err.message);
    }
    
    
},
//count courses for search
countAllSearchPages : async (name,iip)=>{
    try {let count = await Course.find({'enabled':true,'name': new RegExp(name, "i")}).countDocuments();
    return Math.ceil(count/iip);
        
    } catch (err) {
      console.error(err.message);
    }
  
  
},
}