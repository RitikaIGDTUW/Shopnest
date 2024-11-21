const express=require('express');
const User = require('../models/User');
const passport = require('passport');
const router=express.Router();


router.get('/register',(req,res)=>{
    res.render('auth/signup');
})

//actually want to register a user in my DB

router.post('/register',async(req,res)=>{
    try{
        let{email,password,username,role}= req.body;
        const user=new User({email,username,role})
        const newUser=await User.register(user,password);
        // res.redirect('/login');

        req.login(newUser,function(err){
            if(err){
                return next(err)
            }
            req.flash('success',`welcome ${username}`)
            return res.redirect('/products')
        })
    }
    catch(e){
        req.flash('error',e.message);
        return res.redirect('/signup');
    }
    
    
})

//to get login form

router.get('/login',(req,res)=>{
    res.render('auth/login');
})

//to actually login via db
router.post('/login',
    passport.authenticate('local', { 
       failureRedirect: '/login', 
       failureMessage: true ,
    }),
    function(req, res) {
        // console.log(req.user);
        req.flash('success' , `welcome back ${req.user.username}`);
        // console.log(req.session);
        res.redirect(`/products`);
    }
);

//logout

router.get('/logout',(req,res)=>{
    req.flash('success' , 'goodbye friend');
    res.redirect('/login');
})

module.exports=router