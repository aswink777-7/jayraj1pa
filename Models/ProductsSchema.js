const mongoose = require('mongoose')

const ProductsSchemas = new mongoose.Schema({
    productImage:{
        type:String,
        required:true
    },
    productName:{
        type:String,
        required:true,
    },

productDesc:{
    type:String,
    required:true,
},
    productPrice:{
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    }
})

const Product = mongoose.model("Product",ProductsSchemas)
module.exports = Product