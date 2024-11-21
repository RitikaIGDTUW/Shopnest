const express=require('express');
const app=express();
const path=require('path')
const mongoose = require('mongoose');
const seedDB=require('./seed')
const productRoutes=require('./routes/product');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const reviewRoutes=require('./routes/review');
const flash=require('connect-flash')
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local')
const User=require('./models/User');

const authroutes=require('./routes/auth')
const cartRoutes= require('./routes/cart')
const productApi=require('./routes/api/productapi')






mongoose.connect('mongodb://127.0.0.1:27017/shopping-rits-app')
.then(()=>{
    console.log("db connected successfully")
})
.catch((err)=>{
    console.log("db error");
    console.log(err)
})

let configSession={
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires:Date.now()+24*7*60*60*1000,
        maxAge:24*7*60*60*1000
    }    
  }

//seeding database
// seedDB(); 
// i have run it once and then comment out



app.engine('ejs',ejsMate);//here i am setting engine
app.set('view engine','ejs');// here i am definigg work of engine
app.set('views',path.join(__dirname,'views'))//views folder

app.use(express.urlencoded({extended:true})) //otherwise req. body gives undefined
app.use(methodOverride('_method'));
app.use(session(configSession));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success =req.flash('success');//iska content flash.ejs file me h
    res.locals.error =req.flash('error');
    next();
})

//PASSPORT
passport.use(new LocalStrategy(
    User.authenticate()
));



app.use(productRoutes)//so that harr incoming request ke liye ye pg chle
app.use(reviewRoutes)
app.use(authroutes)
app.use(cartRoutes)
app.use(productApi)
//public folder
app.use(express.static(path.join(__dirname,'public')));






app.listen(8080,()=>{
    console.log('server connected at port 8080')
})