const mongoose = require("mongoose");

const register = mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  address: { type: String },
  password: { type: String },
  pinCode: { type: String },
  phoneNO: { type: Number },
  isAdmin: {
     type: Boolean,
    default:false
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

module.exports.userRegistration = mongoose.model("User", register);
