const mongoose = require("mongoose") ;

const AddressSchema = new mongoose.Schema({
  LineAddress1: {
    type: String,
  },
  CompleteAddress: {
    type: String,
  },
  Landmark: {
    type: String,
  },
  Type: {
    type: String,
    required: true,
  },
  Location: {
    lat: { type: Number },
    lon: { type: Number },
  },
});

const CartSchema = new mongoose.Schema(
  {
    CustomerID: {
      type: String,
      required: true,
    },
    CustomerEmail: {
      type: String,
    },
    CustomerFirstName: {
      type: String,
      required: false,
    },
    CustomerMobileNumber: {
      type: Number,
      required: false,
    },
    DeliveryAddress: {
      type: AddressSchema,
      required: false,
    },
    // Products: {
    //   type: mongoose.Types.ObjectId,
    //   ref: 'Product',
    //   required: true,
    // },
    
    // Qty: { 
    //   type: Number, 
    //   required: true
    // },
    
    
    Products: [
      {
        ProductID: { type: String, required: true }, //
        Image: { type: String },
        ProductName: { type: String, required: true },
        MRP: { type: Number, required: true }, //
        // RetailPrice: { type: Number, required: true },//
        Qty: { type: Number, required: true }, //
        SubTotal: { type: Number, required: true }, //qty*rate
        Amount: Number, //
      },
    ],
    Subtotal: {
      type: Number, //all products total
      require: true,
    },

    Amount: Number,
  },
  {
    timestamps: true,
  }
);

module.exports.cartModel= mongoose.model("cart", CartSchema);
