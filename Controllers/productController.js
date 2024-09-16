const Jwt = require("jsonwebtoken");
const { productModel } = require("../Models/productModel.js");
const { categoryModel } = require("../Models/categoryModel.js");
const { subcategoryModel } = require("../Models/subCategoryModel.js");
const { userRegistration } = require("../Models/userModel.js");
const excelToJson = require("convert-excel-to-json");
const dotenv = require("dotenv");
const { deleteUploadedFile } = require("../Confige/FileUpload.js");
dotenv.config();

class productController {
  static getProductList = async (req, res) => {
    const { _id } = req.user;
    const UserData = await userRegistration
      .findOne({ _id: _id })
      .select("-__v");
    if (UserData.isAdmin) {
      const productList = await productModel
        .find({ isActive: true })
        .select("-__v");
      res.status(200).send({ status: "Success", data: productList });
    } else {
      const productList = await productModel
        .find({ isActive: true })
        .select("-__v");
      res.status(200).send({ status: "Success", data: productList });
    }
  };

  static importProduct = async (req, res) => {
    try {
      // Convert Excel data to JSON
      const excelData = excelToJson({
        sourceFile: req.file.path,
      });

      const sheetName = Object.keys(excelData);

      const productsData = excelData[sheetName];
      productsData.shift();

      let dataToSaveInDb = [];

      let errors = [];

      for (let i = 0; i < productsData.length; i++) {
        const product = productsData[i];

        const category = await categoryModel.findOne({
          categoryName: product.I,
        });
        const subCategory = await subcategoryModel.findOne({
          subCategoryName: product.J,
        });

        if (product.I.trim() !== category.categoryName) {
          errors.push(`category not found with name ${product.I}`);
        }

        if (product.J.trim() !== subCategory.subCategoryName) {
          errors.push(`subcategory not found with name ${product.J}`);
        }

        dataToSaveInDb.push({
          ProductName: product.A,
          ProductPrice: product.B,
          SKU: product.C,
          ISBN: product.D,
          AuthorName: product.E,
          PageNumber: product.F,
          PaperbackAmount: product.G,
          productDescription: product.H,
          categoryName: product.I,
          categoryById: category._id,
          subCategoryName: product.J,
          subCategoryById: subCategory._id,
          Discountamount: product.K,
          Discountpercentage: product.L,
          Refundable: Boolean(product.M),
          Cancelable: Boolean(product.N),
          Returnable: Boolean(product.O),
          ProductImage: product.P,
          ProductImages: [product.P, product.Q, product.R, product.S].filter(imageUrl => imageUrl && imageUrl.trim() !== ''),
          isActive: true,
        });
      }

      if (errors.length > 0) {
        return res.status(401).send({
          status: "Fail",
          message: errors,
        });
      }
      const savedProducts = await productModel.insertMany(dataToSaveInDb);
      deleteUploadedFile(req.file.path);
      return res.status(200).send({ status: "Success", data: savedProducts });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ status: "Fail", message: "something went wrong" });
    }
  };

  // static createProduct = async (req, res) => {
  //   try {
  //     var productData = req.body;
  //     var files = req.files;
  //     if (
  //       files !== null &&
  //       productData.productName &&
  //       productData.productDescription &&
  //       productData.productPrice
  //     ) {
  //       productData.isActive = true;
  //       const productImage = files["productImage"]
  //         ? process.env.SERVER_URL +
  //           "/image/" +
  //           files["productImage"][0].filename
  //         : null;

  //       var data = {
  //         ...productData,
  //         productImage,
  //       };
  //       const productDocument = new productModel(data);
  //       await productDocument.save();
  //       res.status(200).send({
  //         status: "Success",
  //         message: "Product created successfully",
  //       });
  //     } else {
  //       res.status(400).send({ status: "Fail", message: "all field required" });
  //     }
  //   } catch (error) {
  //     res.status(401).send({ status: "Fail", message: "something went wrong" });
  //   }
  // };

  static createProduct = async (req, res) => {
    try {
      const user = await userRegistration.findOne({ _id: req.user._id });

      if (user.isAdmin) {
        const product = new productModel({...req.body});
        await product.save();

        return res.status(200).json({
          status: "Success",
          message: "created successfully",
          data: product,
        });
      } else {
        return res.status(401).json({
          status: "fail",
          message: "you are not allowed",
        });
      }
    } catch (error) {
      console.log("error in createProduct()", error);
      res.status(500).json({ status: "Fail", message: error.message });
    }
  };

  // static updateProduct = async (req, res) => {
  //   try {
  //     var productData = req.body;
  //     // let existingData = await categoryModel.findOne({ _id: categoryData._id });
  //     var files = req.files;
  //     const _id = productData._id;
  //     if (files && productData.productName) {
  //       const productImage = files["productImage"]
  //         ? files["productImage"][0].filename
  //         : null;
  //       var data = {
  //         ...productData,
  //         productImage,
  //       };

  //       const updatedProduct = await productModel
  //         .findByIdAndUpdate(_id, { $set: data }, { new: true })
  //         .select("-__v"); //saving in DB
  //       res.status(200).send({
  //         status: "Success",
  //         message: "updated successfully",
  //         data: updatedProduct,
  //       });
  //     } else {
  //       res.status(400).json({ status: "Fail", message: "All field required" });
  //     }
  //   } catch (err) {
  //     res.status(400).json({ status: "Fail", message: err.message });
  //   }
  // };

  static updateProduct = async (req, res) => {
    try {

      const productId = req.params.id; 
      const product = await productModel.findById(productId);
  
      if (!product) {
        return res.status(404).json({
          status: "Fail",
          message: "Product not found",
        });
      }
  
      Object.assign(product, req.body);

      const updatedProduct = await product.save();
  
      return res.status(200).json({
        status: "Success",
        message: "Product updated successfully",
        data: updatedProduct,
      });
  
    } catch (error) {
      console.log("Error in updateProduct()", error);
      res.status(500).json({ status: "Fail", message: error.message });
    }
  };

  static deleteProduct = async (req, res) => {
    const { _id } = req.body;

    // if ((isActive === false) && _id) {
    try {
      await productModel.findByIdAndUpdate(
        _id,
        { $set: { isActive: false } },
        { new: true }
      );
      res
        .status(200)
        .send({ status: "Success", message: "Delete Successfully " });
    } catch (error) {
      res.status(400).send({
        status: "Fail",
        message: "Product delete unsuccessful ",
        data: error.message,
      });
    }
    // } else {
    //   res.status(400).send({ status: "Fail", message: "all felid required " });
    // }
  };

  static getProductListByCateId = async (req, res) => {
    var id = req.params.id;
    if (id) {
      const productData = await productModel
        .find({ categoryById: id })
        .select("-__v");
      if (productData) {
        res.status(200).send({ status: "Success", data: productData });
      } else {
        res
          .status(200)
          .send({ status: "Fail", message: "Data is not available" });
      }
    } else {
      res
        .status(400)
        .send({ status: "Fail", message: "Please sent Proper Product Id" });
    }
  };

  static getOneProduct = async (req, res) => {
    try {
      const product = await productModel.findOne({_id: req.params.id});

      return res.status(200).json({status: "success", product})
    } catch (error) {
      res
        .status(400)
        .send({ status: "Fail", message: error.message });
    }
  }
}
module.exports = productController;
