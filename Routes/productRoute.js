const express = require( "express");
const productController = require( "../Controllers/productController.js")
const checkUserAuth = require( "../Middleware/authMiddleware.js");
const {Upload} = require( "../Confige/FileUpload.js");
const categoryRoute= express.Router();

categoryRoute.get('/listByCate/:id',productController.getProductListByCateId);
categoryRoute.get('/list' ,productController.getProductList);
categoryRoute.get('/one/:id', productController.getOneProduct);
categoryRoute.post('/upload', checkUserAuth, Upload.single("productData") , productController.importProduct)
categoryRoute.post('/create',checkUserAuth, productController.createProduct );
//categoryRoute.post('/create',checkUserAuth,Upload.fields([{name:"productImage",maxCount:1}]),productController.createProduct);
categoryRoute.put('/update/:id',checkUserAuth, productController.updateProduct );
//categoryRoute.put('/update',checkUserAuth,Upload.fields([{name:"productImage",maxCount:1}]),productController.updateProduct);
categoryRoute.post('/delete',productController.deleteProduct);
module.exports = categoryRoute; 