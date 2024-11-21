const express=require('express');
const Product=require('../models/Product')
const Review= require('../models/Reviews')
const router=express.Router(); //mini instance of app or mini server 
const{validateProduct,isLoggedIn, isSeller, isProductAuthor}=require('../middleware');//these two are for valildating the product when we add


//about page

router.get('/about', (req, res) => {
    res.render('products/about');
  });

//to show all products

// router.get('/products',isLoggedIn,async(req,res)=>{
//     try{
//         let products=await Product.find({})
//     res.render('products/index',{products}) //render index.ejs
//     }
//     catch(e){
//         res.status(500).render('error',{err:e.message});
//     }
    
// })

router.get('/products', isLoggedIn, async (req, res) => {
    try {
      let products = await Product.find({});
      let categorizedProducts = {};
      
      products.forEach(product => {
        if (!categorizedProducts[product.category]) {
          categorizedProducts[product.category] = [];
        }
        categorizedProducts[product.category].push(product);
      });
  
      res.render('products/index', { categorizedProducts });
    } catch (e) {
      res.status(500).render('error', { err: e.message });
    }
  });
  

//to show the form for new product
router.get('/product/new',isLoggedIn,(req,res)=>{
    try{
        res.render('products/new');
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
    
}
)

//to actually add the product
router.post('/products',isLoggedIn,isSeller,validateProduct, async(req,res)=>{
    try{
        let {name, img, price,category, desc}=req.body; //app.js me jake middleware lga dena "urlencoded"
        await Product.create({name, img, price,category, desc, author:req.user._id}) //create command of mongodb on model Product
        req.flash('success','product added successfully')
        res.redirect('/products')
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
    
})


//to show a particular product
router.get('/products/:id',isLoggedIn,async(req,res)=>{
    try{
        let {id}=req.params;
        let foundproduct= await Product.findById(id).populate('reviews'); //sath me reviews populate krwane ke liye..
        res.render('products/show',{foundproduct, msg:req.flash('msg')})
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
    
})



//form to edit the product
router.get('/products/:id/edit',isLoggedIn, async (req, res) => {
    try{
        let { id } = req.params;
        let foundproduct = await Product.findById(id);
        res.render('products/edit', { foundproduct });
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
    
});

//to actually edit the data in db
router.patch('/products/:id',isLoggedIn,isSeller,validateProduct, async(req,res)=>{
    try{
        let {id}=req.params;
        let {name,img,price,category, desc}=req.body;
        await Product.findByIdAndUpdate(id, {name,img,price,category, desc})//two arguments id and jo form submit krne ke bad milega
        req.flash('success','product edited successfully')
        res.redirect(`/products/${id}`); //show that particular product after editing
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
    
})


//to delete a product

router.delete('/products/:id',isLoggedIn,isProductAuthor,isSeller,async(req,res)=>{
    try{
        let {id}=req.params;
    const product=await Product.findById(id);
    //in review collection, i have list of all the reviews of all products, but i have to delete those who have same id as of deleted product
    //given method where i am deleting the reviews first using for loop is not ideal way
    //ideal way would be use of middleware (mongoose middlewares)
    //before using method findidanddelete a middleware run (findoneandupdate)
    //which is used over schema
    // for(let id of product.reviews){
    //    await Review.findByIdAndDelete(id);
    // }
    await Product.findByIdAndDelete(id); //iske bad middle ware chlega jo product schema me h
    req.flash('success','product deleted successfully')
    res.redirect('/products')
    }
    catch(e){
        res.status(500).render('error',{err:e.message}); 
    }
    
})

module.exports=router;