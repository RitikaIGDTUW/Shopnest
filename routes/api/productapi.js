const express=require('express');
const router=express.Router();
let {isLoggedIn}=require('../../middleware');
const User = require('../../models/User');

router.post('/product/:productId/like',isLoggedIn,async(req,res)=>{
    let {productId}=req.params;
    let user=req.user;
    let isLiked=user.wishList.includes(productId);//true/false ya to wishlist ke ander poduct id hogi ya nhii
    //agr hogii to hata denge agr nhi hogii to add kr denge
    
    // if(isLiked){
    //    await User.findByIdAndUpdate(req.user._id,{$pull:{wishList:productId}})//User ko id se find kiya and then wishlist me product ko nikal liya
    // }
    // else{
    //    await User.findByIdAndUpdate(req.user._id , {$addToSet:{wishList:productId}}) 
    // }

    const option = isLiked? '$pull' : '$addToSet';
    //the below code can be done by else if as well
    req.user = await User.findByIdAndUpdate(req.user._id , {[option]:{wishList:productId}} , {new:true} )
    //new:true return updated one document
    res.send('like done api');

})


module.exports=router;