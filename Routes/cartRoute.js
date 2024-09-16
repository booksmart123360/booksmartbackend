const express =require( "express");
const checkUserAuth =require( "../Middleware/authMiddleware.js");
const Upload =require( "../Confige/FileUpload.js");
const cartController =require( "../Controllers/cartController.js");
const cartRoute= express.Router();

// categoryRoute.get('/list/:id', checkUserAuth,categoryController.getCategoryById);
// categoryRoute.get('/list',checkUserAuth ,categoryController.getCategoryList);
cartRoute.post('/create',checkUserAuth,cartController.createCart);
cartRoute.get('/list', checkUserAuth,cartController.getCartList);

module.exports = cartRoute; 