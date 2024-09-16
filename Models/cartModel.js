const mongoose = require("mongoose");

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
      required: true,
    },
    CustomerLastName: {
      type: String,
      required: true,
    },
    CustomerMobileNumber: {
      type: Number,
      required: true,
    },
    DeliveryAddress: {
      type: AddressSchema,
      required: true,
    },
    Products: [
      {
        ProductID: { type: String, required: true }, //
        ProductImage: { type: String },
        ProductName: { type: String, required: true },
        ISBN: { type: String },
        AuthorName: { type: String },
        PageNumber: { type: Number },
        Paperback: { type: Boolean },
        PaperbackAmount: { type: Number },
        HardCover: { type: Boolean },
        categoryName: { type: String },
        categoryById: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          require: true,
        },
        subCategoryName: { type: String },
        subCategoryById: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubCategory",
        },
        ProductPrice: { type: Number, required: true }, //
        Discountamount: { type: Number },
        Discountpercentage: { type: Number },
        Qty: { type: Number, required: true }, //
        SubTotal: { type: Number, required: true }, //qty*rate
        Amount: Number, //
      },
    ],
    Discountamount: { type: Number },
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

module.exports.cartModel = mongoose.model("cart", CartSchema);
