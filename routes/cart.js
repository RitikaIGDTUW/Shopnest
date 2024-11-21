const express=require('express');
const router=express.Router() //mini instance
const {isLoggedIn}=require('../middleware')
const Product=require('../models/Product')
const User=require('../models/User')


//route to see the cart
router.get('/user/cart',isLoggedIn,async(req,res)=>{
    let user= await User.findById(req.user._id).populate('cart') //here
    //populate is for actually retrrieving the actual infos of products from the cart where product ids are stored only
    res.render('cart/cart',{user})
})


//actually adding product to the cart
router.post('/user/:productId/add',isLoggedIn,async(req,res)=>{
    let {productId}=req.params;
    let userId= req.user._id;
    let product=await Product.findById(productId)
    let user=await User.findById(userId)
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart');
})

// Route to delete a product from the cart
router.delete('/user/:productId/remove', isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    try {
        // Find the user and remove the product from their cart
        let user = await User.findById(userId);

        // Remove the product by its ID
        user.cart.pull(productId); // `pull` removes the specified product ID from the cart array
        await user.save(); // Save the updated user document

        res.redirect('/user/cart'); // Redirect back to the cart page
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while removing product from cart.");
    }
});




module.exports=router;