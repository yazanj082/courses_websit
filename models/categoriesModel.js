const mongoose = require('mongoose');

//connecting to my db and collection
mongoose.connect('mongodb://localhost:27017/elearningDB', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  //making my documents schema
  const categorySchema={
    name:String,
    enabled:Boolean,
    
}
const Category = mongoose.model('Category',categorySchema);
module.exports = {
    //to add new category
      addCategory : (name ,enabled)=>{
        const newCategory = new Category({
           name:name,
           enabled:enabled,
            
            });
            newCategory.save();
      },
      //update existing category
      updateCategory : async(id,name ,enabled)=>{
        const category =  await Category.findById(id);
            category.name=name;
            category.enabled=enabled;
            category.save();
      },
      //list all categories
      listCategories : async ()=>{
        try {
            const list = await Category.find().lean();
        return list;
        } catch (err) {
            console.error(err.message);
        }
        
        
    },
    getById : async (id)=>{
        try {
            const category = await Category.findById(id);
        return category;
        } catch (err) {
            console.error(err.message);
        }
        
        
    },
    
deleteCategory : async (id)=>{
    try {
    
        await Category.findByIdAndDelete(id);
    } catch (err) {
        console.error(err.message);
    }
  },
  //list categories in main site dropdown list
  listCategoriesMenu : async ()=>{
    try {
        const list = await Category.find().where('enabled').equals(true).lean();
    return list;
    } catch (err) {
        console.error(err.message);
    }
    
    
},

}