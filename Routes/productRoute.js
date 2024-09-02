const express = require( "express");
const productController = require( "../Controllers/productController.js")
const checkUserAuth = require( "../Middleware/authMiddleware.js");
const {Upload} = require( "../Confige/FileUpload.js");
const categoryRoute= express.Router();

categoryRoute.get('/listByCate/:id', checkUserAuth,productController.getProductListByCateId);
categoryRoute.get('/list',checkUserAuth ,productController.getProductList);
categoryRoute.post('/upload', checkUserAuth, Upload.single("productData") , productController.importProduct)
categoryRoute.post('/create',checkUserAuth,Upload.fields([{name:"productImage",maxCount:1}]),productController.createProduct);
categoryRoute.put('/update',checkUserAuth,Upload.fields([{name:"productImage",maxCount:1}]),productController.updateProduct);
categoryRoute.delete('/delete',checkUserAuth,productController.deleteProduct);
module.exports = categoryRoute; 