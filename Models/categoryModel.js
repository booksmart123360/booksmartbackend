const mongoose = require("mongoose");

const category = mongoose.Schema({
  categoryName: { type: String },
  categoryImage: { type: String },
  categoryBannerImage: {type:Array}, 
  isActive:{type:Boolean} 
});

module.exports.categoryModel=mongoose.model("Category",category);
