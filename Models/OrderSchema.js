const mongoose = require('mongoose')
const { Schema } = mongoose;  // Import Schema from mongoose


const OrderSchema = new mongoose.Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product'
        },
        productName: {
          type: String,
          required: true
        },
        productPrice: {
          type: Number,
          required: true
        },
        username:{
            type:String,
            required: true
        },
        address:{
            type:String,
            required: true
        },
        // Add any other necessary product fields
      }
    ],
    date: {
      type: Date,
      default: Date.now
    }
  });
  


const orders = mongoose.model("orders",OrderSchema)
module.exports = orders














