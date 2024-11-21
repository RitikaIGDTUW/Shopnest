const mongoose=require('mongoose')
//this file is used to insert demo data

const Product=require('./models/Product'); //so that we can use insertMany which works on model

const products=[
    {
        name:"Iphone 16pro",
        img:"https://plus.unsplash.com/premium_photo-1680985551009-05107cd2752c?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aXBob25lJTIwMTZ8ZW58MHx8MHx8fDA%3D",
        price:160000,
        desc:"very costly,aukat ke bahar"
    },
    {
        name:"macbook m2",
        img:"https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFjYm9va3xlbnwwfHwwfHx8MA%3D%3D",
        price:250000,
        desc:"ye to bilkul hi aukat ke bahar"
    },
    {
        name:"iwatch",
        img:"https://images.unsplash.com/photo-1516375610492-910a43876383?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aXdhdGNofGVufDB8fDB8fHww",
        price:51000,
        desc:"ye to sasta hai lelo"
    },
    {
        name:"ipad pro",
        img:"https://images.unsplash.com/photo-1607452263110-39a87c399c50?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBhZCUyMHByb3xlbnwwfHwwfHx8MA%3D%3D",
        price:237900,
        desc:"life me kuchh cheeze dekhne ke liye h"

    },
    {
        name:"airpods",
        img:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:25000,
        desc:"badiya hai kamao kamao"
    }

]


async function seedDB(){
    await Product.insertMany(products); //return promise
    console.log("data seeded successfully")
}

module.exports=seedDB;