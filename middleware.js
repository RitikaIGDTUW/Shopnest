const {productSchema, reviewSchema}=require('./schema')
const Product=require('./models/Product')
const Review = require('./models/Reviews');


const validateProduct=(req,res,next)=>{
    let {name, img,price,desc}=req.body;
    const{error}=productSchema.validate({name, img,price,desc}) //i have just to catch the error
    if(error){
        return res.render('error');
    }
    next(); //if there is no error next wala middle ware chlega
}

const validateReview=(req,res,next)=>{
    let {rating,comment}=req.body;
    const{error}=reviewSchema.validate({rating,comment}) //i have just to catch the error
    if(error){
        return res.render('error');
    }
    next();
}


//jab tak banda authenticated na ho wo products view na kre
const isLoggedIn=(req,res,next)=>{
    if(req.xhr && !req.isAuthenticated()){
        return res.status(401).json({msg:'you need to login first'});
    }
    
    if(!req.isAuthenticated()){
        req.flash('error' , 'you need to login first');
        return res.redirect('/login');
    }
    next();
}

const isSeller=(req,res,next)=>{
    if(!req.user.role){
        req.flash('error','you do not have the permission to do that');
        return res.redirect('/products')
    }
    else if(req.user.role!=='seller'){
        req.flash('error','you donot have the permission to do that');
        return res.redirect('/products')
    }
    next();
}

const isProductAuthor=async(req,res,next)=>{
    let {id}=req.params;//product id
    let product=await Product.findById(id);//entire product
    //two object ids can be compared using equals
    if(!product.author.equals(req.user._id)){
        req.flash('error','you donot have the permission to do that');
        return res.redirect('/products')
    }
    next();
}
const isReviewAuthor = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review) {
            req.flash('error', 'Review not found');
            return res.redirect(`/products/${req.params.productId}`);
        }
        if (!review.author || review.author.toString() !== req.user._id.toString()) {
            req.flash('error', 'You do not have permission to delete this review');
            return res.redirect(`/products/${req.params.productId}`);
        }
        next();
    } catch (e) {
        req.flash('error', 'Something went wrong!');
        res.redirect('back');
    }
};



module.exports={isProductAuthor,validateReview,validateProduct,isLoggedIn,isSeller,isReviewAuthor};