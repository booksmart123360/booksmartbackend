const express = require( "express");
const subCategoryController = require( "../Controllers/subCategoryController.js")
const checkUserAuth = require( "../Middleware/authMiddleware.js");
//const Upload = require( "../Confige/FileUpload.js");
const subCategoryRoute= express.Router();

subCategoryRoute.post('/create', checkUserAuth,subCategoryController.createSubCategory);
subCategoryRoute.get('/list',checkUserAuth ,subCategoryController.getSubCategoryList);
subCategoryRoute.get('/listByCateID/:id',checkUserAuth ,subCategoryController.getSubCategoryListbyCateId);
// subCategoryRoute.post('/create',checkUserAuth,Upload.fields([{name:"categoryImage",maxCount:1},{name:"categoryBannerImage",maxCount:10}]),categoryController.createCategory);
// subCategoryRoute.put('/update',checkUserAuth,Upload.fields([{name:"categoryImage",maxCount:1},{name:"categoryBannerImage",maxCount:10}]),categoryController.updateCategory);
subCategoryRoute.post('/delete',checkUserAuth,subCategoryController.deleteSubCategory);
subCategoryRoute.put('/update',checkUserAuth,subCategoryController.updateSubcategory);

module.exports=  subCategoryRoute; 