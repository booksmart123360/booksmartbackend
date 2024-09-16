const mongoose = require("mongoose");

const product = mongoose.Schema({
  ProductName: { type: String },
  ProductPrice: { type: Number },
  SKU:{type: String},
  ISBN: {type: String},
  AuthorName: {type: String},
  PageNumber: {type: Number},
  PaperbackAmount: {type: Number},
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
  Discountamount: {type: Number},
  Discountpercentage: {type: Number},
  Refundable: {type: Boolean},
  Cancelable: {type: Boolean},
  Returnable: {type: Boolean},
  ProductImage: { type: String },
  ProductImages: [String],
  isActive: { type: Boolean },
});

module.exports.productModel = mongoose.model("Product", product);
