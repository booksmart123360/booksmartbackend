const Jwt = require("jsonwebtoken");
const { productModel } = require("../Models/productModel.js");
const {categoryModel} = require("../Models/categoryModel.js");
const {subcategoryModel} = require("../Models/subCategoryModel.js")
const { userRegistration } = require("../Models/userModel.js");
const excelToJson = require("convert-excel-to-json");
const dotenv = require("dotenv");
const { deleteUploadedFile } = require("../Confige/FileUpload.js")
dotenv.config();

class productController {
  static getProductList = async (req, res) => {
    const { _id } = req.user;
    const UserData = await userRegistration
      .findOne({ _id: _id })
      .select("-__v");
    if (UserData.isAdmin) {
      const productList = await productModel.find().select("-__v");
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

      for (let i = 0; i < productsData.length; i++) {
        const product = productsData[i];

        const categoryById = await categoryModel.findOne({categoryName: product.D}).select("_id");
        const subCategoryById = await subcategoryModel.findOne({subCategoryName: product.E}).select("_id");

        dataToSaveInDb.push({
          productName: product.A,
          productImage: product.B,
          productPrice: product.C,
          productDescription: product.D,
          categoryById: categoryById,
          subCategoryById: subCategoryById,
          isActive: false,
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

  static createProduct = async (req, res) => {
    try {
      var productData = req.body;
      var files = req.files;
      if (
        files !== null &&
        productData.productName &&
        productData.productDescription &&
        productData.productPrice
      ) {
        productData.isActive = true;
        const productImage = files["productImage"]
          ? process.env.SERVER_URL +
            "/image/" +
            files["productImage"][0].filename
          : null;

        var data = {
          ...productData,
          productImage,
        };
        const productDocument = new productModel(data);
        await productDocument.save();
        res.status(200).send({
          status: "Success",
          message: "Product created successfully",
        });
      } else {
        res.status(400).send({ status: "Fail", message: "all field required" });
      }
    } catch (error) {
      res.status(401).send({ status: "Fail", message: "something went wrong" });
    }
  };

  static updateProduct = async (req, res) => {
    try {
      var productData = req.body;
      // let existingData = await categoryModel.findOne({ _id: categoryData._id });
      var files = req.files;
      const _id = productData._id;
      if (files && productData.productName) {
        const productImage = files["productImage"]
          ? files["productImage"][0].filename
          : null;
        var data = {
          ...productData,
          productImage,
        };

        const updatedProduct = await productModel
          .findByIdAndUpdate(_id, { $set: data }, { new: true })
          .select("-__v"); //saving in DB
        res.status(200).send({
          status: "Success",
          message: "updated successfully",
          data: updatedProduct,
        });
      } else {
        res.status(400).json({ status: "Fail", message: "All field required" });
      }
    } catch (err) {
      res.status(400).json({ status: "Fail", message: err.message });
    }
  };

  static deleteProduct = async (req, res) => {
    const { isActive, _id } = req.body;
    if ((isActive == false || isActive == true) && _id) {
      try {
        await productModel.findByIdAndUpdate(
          _id,
          { $set: { isActive: isActive } },
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
    } else {
      res.status(400).send({ status: "Fail", message: "all felid required " });
    }
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
}
module.exports = productController;
