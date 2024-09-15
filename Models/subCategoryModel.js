const mongoose = require("mongoose");

const subCategory = mongoose.Schema({
  subCategoryName: { type: String },
  categoryName: {type: String},
  categoryById: { 
    type: mongoose.Schema.Types.ObjectId,
    ref:"Category",
    require:true,
},
isActive:{type:Boolean}
 
});

module.exports.subcategoryModel =mongoose.model("SubCategory",subCategory);