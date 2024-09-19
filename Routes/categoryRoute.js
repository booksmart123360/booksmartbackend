const express = require( "express");
const categoryController = require( "../Controllers/categoryController.js")
const checkUserAuth = require( "../Middleware/authMiddleware.js");
const {Upload} = require( "../Confige/FileUpload.js");
const categoryRoute= express.Router();

categoryRoute.get('/list/:id',categoryController.getCategoryById);
categoryRoute.get('/list' ,categoryController.getCategoryList);
// categoryRoute.post('/create',checkUserAuth,Upload.fields([{name:"categoryImage",maxCount:1},{name:"categoryBannerImage",maxCount:10}]),categoryController.createCategory);
// categoryRoute.put('/update',checkUserAuth,Upload.fields([{name:"categoryImage",maxCount:1},{name:"categoryBannerImage",maxCount:10}]),categoryController.updateCategory);
categoryRoute.post('/delete',checkUserAuth,categoryController.deleteCategory);
categoryRoute.post('/create',checkUserAuth,categoryController.createCategory);
categoryRoute.put('/update',checkUserAuth,categoryController.updateCategory);
module.exports = categoryRoute; 