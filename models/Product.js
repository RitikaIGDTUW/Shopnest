const mongoose=require("mongoose")
const Review=require('../models/Reviews')


const productSchema=new mongoose.Schema({
    name:{
        type:String,
        trime:true,
        required:true
    } ,
    img:{
        type:String,
        trim:true,
        // default:
    },
    price:{
        type:Number,
        min:0,        
        required:true
    },
    desc:{
        type:String,
        trim:true
    },
    avgRating:{
        type:Number,
        default:0
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId, //ham khi aur se utha rhe h ye object id
            ref:'Review' //ye object id review ke schema model se uthani h
        }
    ],
    category: {
        type: String,
        enum: ['Toys', 'Jewelleries', 'home_decor', 'T-Shirts', 'Women-Dress', 'Men-Dress'],
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
        
  
    
})

//middleware jo BTS mongodb operation karwane par use hota hai and isek
//ander pre and post middleware hote h which are basicaaly used over the schema and before the model
//is js class

productSchema.post('findOneAndDelete', async function (product) {
    if (product.reviews.length > 0) {
        console.log("Deleting associated reviews:", product.reviews);
        await Review.deleteMany({ _id: { $in: product.reviews } });
    }
});


let Product=mongoose.model('Product',productSchema)
module.exports=Product;