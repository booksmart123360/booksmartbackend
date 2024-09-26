const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  redirectTo: {
    type: String,
    required: true,
  },
  showOnHomePage: {
    type: Boolean,
    required: true,
  },
  images: [String],
  isActive: Boolean,
});

module.exports = mongoose.model("slider", sliderSchema);
