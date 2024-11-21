const express=require('express');
const Product = require('../models/Product');
const Review = require('../models/Reviews');
const router=express.Router(); //mini instance of app or mini server
const {validateReview}=require('../middleware'); 
const {isReviewAuthor}=require('../middleware');
const {isLoggedIn}=require('../middleware')

router.post('/products/:id/review', validateReview, async(req,res)=>{
    try{
        let {id}=req.params;//id ki help se product ko dhoondhna h
    let{rating,comment}=req.body ;
    const product= await Product.findById(id);

    const review=new Review({rating,comment,author:req.user._id});

    //Average rating logic
    if (isNaN(product.avgRating) || isNaN(product.reviews.length) || isNaN(rating)) {
        req.flash('error', 'Invalid data for rating or product.');
        return res.redirect(`/products/${id}`);
    }
    const newAverageRating = ((product.avgRating * product.reviews.length) + parseInt(rating)) / (product.reviews.length + 1);
product.avgRating = parseFloat(newAverageRating.toFixed(1));

       

    //ab jo product find kiya maine byid uske reviews me mai ye new review push kr deti hu
     product.reviews.push(review);

    //now in shell i get to see two databases
    //first is review in which i have a review id ,rating and comment
    //second is products which has desc of product and id of review made corresponding to that product
    //through that object id i can go to that particular review id in review database 
    //and can see about the reviews

     //now i have to save review and product
     await review.save();
     await product.save();

     req.flash('success','Review added successfully')
     res.redirect(`/products/${id}`)
    }
    catch(e){
        res.status(500).render('error',{err:e.message})
    }
})

// router.delete('/products/:productId/review/:reviewId',isLoggedIn,isReviewAuthor, async (req, res) => {
//     try {
//         const { productId, reviewId } = req.params;

//         // Remove the review from the `Product` model
//         const product = await Product.findById(productId);
//         if (!product) {
//             req.flash('error', 'Product not found');
//             return res.redirect('/products');
//         }

//         // Filter out the review from the product's reviews array
//         product.reviews = product.reviews.filter(
//             (review) => review._id.toString() !== reviewId
//         );

//         // Recalculate average rating
//         if (product.reviews.length > 0) {
//             const totalRating = product.reviews.reduce((sum, reviewId) => {
//                 const review = Review.findById(reviewId);
//                 return sum + review.rating;
//             }, 0);
//             product.avgRating = (totalRating / product.reviews.length).toFixed(1);
//         } else {
//             product.avgRating = 0;
//         }

//         await product.save();

//         // Remove the review document from the `Review` model
//         await Review.findByIdAndDelete(reviewId);

//         req.flash('success', 'Review deleted successfully');
//         res.redirect(`/products/${productId}`);
//     } catch (e) {
//         res.status(500).render('error', { err: e.message });
//     }
// });


router.delete('/products/:productId/review/:reviewId', isReviewAuthor, async (req, res) => {
    try {
        const { productId, reviewId } = req.params;

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            req.flash('error', 'Product not found.');
            return res.redirect('/products');
        }

        // Find and delete the review
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect(`/products/${productId}`);
        }

        // Update reviews array and avgRating
        product.reviews = product.reviews.filter((revId) => revId.toString() !== reviewId);

        if (product.reviews.length === 0) {
            product.avgRating = 0; // No reviews left
        } else {
            const validReviews = await Review.find({ _id: { $in: product.reviews } });
            const totalRating = validReviews.reduce((sum, rev) => sum + rev.rating, 0);
            product.avgRating = parseFloat((totalRating / validReviews.length).toFixed(1));
        }

        await product.save();

        req.flash('success', 'Review deleted successfully.');
        res.redirect(`/products/${productId}`);
    } catch (e) {
        res.status(500).render('error', { err: e.message });
    }
});




module.exports=router;