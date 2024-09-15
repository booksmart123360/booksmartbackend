const mongoose = require("mongoose");

const product = mongoose.Schema({
  productName: { type: String },
  productImage: { type: String },
  productPrice: { type: Number },
  productDescription: { type: String },
  categoryName: {type:String},
  categoryById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    require: true,
  },
  subCategoryName: {type: String},
  subCategoryById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  isActive: { type: Boolean },
});

module.exports.productModel = mongoose.model("Product", product);
