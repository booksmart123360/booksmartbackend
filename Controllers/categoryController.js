const { categoryModel } = require("../Models/categoryModel.js");
const Jwt = require("jsonwebtoken");
const { userRegistration } = require("../Models/userModel.js");
const dotenv = require("dotenv");
dotenv.config();

class categoryController {
  static getCategoryById = async (req, res) => {
    var id = req.params.id;
    const categoryList = await categoryModel
      .findOne({ _id: id })
      .select("-__v");
    if (categoryList) {
      res.status(200).send({ status: "Success", data: categoryList });
    } else {
      res
        .status(400)
        .send({ status: "Fail", message: "record is not available" });
    }
  };

  static getCategoryList = async (req, res) => {
    // const { _id } = req.user;
    // const UserData = await userRegistration
    //   .findOne({ _id: _id })
    //   .select("-__v");
    // if (UserData.isAdmin) {
      const categoryList = await categoryModel.find({isActive: true}).select("-__v");
      res.status(200).send({ status: "Success", data: categoryList });
    // } else {
    //   const categoryList = await categoryModel
    //     .find({ isActive: true })
    //     .select("-__v");
    //   res.status(200).send({ status: "Success", data: categoryList });
    // }
  };

  static createCategory = async (req, res) => {
    try {
      var categoryData = req.body;
      var files = req.files;
      //   &&
      //     categoryData.categoryImage &&
      //     categoryData.categoryBannerImage
      // if (files && categoryData.categoryName) {
      //   categoryData.isActive = true;
      //   const categoryImage = files["categoryImage"]
      //     ? process.env.SERVER_URL +
      //       "/image/" +
      //       files["categoryImage"][0].filename
      //     : null;
      //   const categoryBannerImage = files["categoryBannerImage"]
      //     ? files["categoryBannerImage"].map(
      //         (file) => process.env.SERVER_URL + "/image/" + file.filename
      //       )
      //     : [];
      //   var data = {
      //     ...categoryData,
      //     categoryBannerImage,
      //     categoryImage,
      //   };
      //    var data = {
      //     ...categoryData,
      //     categoryBannerImage,
      //     categoryImage,
      //   };
      //   const categoryDocument = new categoryModel(data);
      //   await categoryDocument.save();
      //   res.status(200).send({
      //     status: "Success",
      //     message: "category created successfully",
      //   });
      // } else {
      //   res.status(400).send({ status: "Fail", message: "all field required" });
      // }
      var data = {
        ...categoryData,
        categoryBannerImage: [],
        categoryImage: "",
      };
      const categoryDocument = new categoryModel(data);
      await categoryDocument.save();
      res.status(200).send({
        status: "Success",
        message: "category created successfully",
      });
    } catch (error) {
      res.status(401).send({ status: "Fail", message: "something went wrong" });
    }
  };

  static updateCategory = async (req, res) => {
    try {
      var categoryData = req.body;
      // let existingData = await categoryModel.findOne({ _id: categoryData._id });
      var files = req.files;
      const _id = categoryData._id;
      // if (files && categoryData.categoryName) {
      //   const categoryImage = files["categoryImage"]
      //     ? files["categoryImage"][0].filename
      //     : null;
      //   const categoryBannerImage = files["categoryBannerImage"]
      //     ? files["categoryBannerImage"].map((file) => file.filename)
      //     : [];
      //   var data = {
      //     ...categoryData,
      //     categoryBannerImage,
      //     categoryImage,
      //   };

      //   const updatedCategory = await categoryModel
      //     .findByIdAndUpdate(_id, { $set: data }, { new: true })
      //     .select("-__v"); //saving in DB
      //   res.status(200).send({
      //     status: "Success",
      //     message: "updated successfully",
      //     data: updatedCategory,
      //   });
      // } else {
      //   res.status(400).json({ status: "Fail", message: "All field required" });
      // }
      var data = {
            ...categoryData,
            categoryBannerImage:[],
            categoryImage:"",
          };
      const updatedCategory = await categoryModel
          .findByIdAndUpdate(_id, { $set: data }, { new: true })
          .select("-__v"); //saving in DB
        res.status(200).send({
          status: "Success",
          message: "updated successfully",
          data: updatedCategory,
        });

    } catch (err) {
      res.status(400).json({ status: "Fail", message: err.message });
    }
  };

  static deleteCategory = async (req, res) => {
    const { isActive, _id } = req.body;
   // if (isActive == false  && _id) {
      try {
        await categoryModel.findByIdAndUpdate(
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
          message: "Category delete unsuccessful ",
          data: error.message,
        });
      }
    // } else {
    //   res.status(400).send({ status: "Fail", message: "all felid required " });
    // }
  };
}
module.exports = categoryController;
