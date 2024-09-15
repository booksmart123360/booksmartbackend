const { subcategoryModel } = require("../Models/subCategoryModel.js");
const { userRegistration } = require("../Models/userModel.js");

class subCategoryController {
  static createSubCategory = async (req, res) => {
    try {
      var subcategoryData = req.body;
      if (subcategoryData.subCategoryName && subcategoryData.categoryById) {
        subcategoryData.isActive = true;
        const categoryDocument = new subcategoryModel(subcategoryData);
        await categoryDocument.save();
        res.status(200).send({
          status: "Success",
          message: "SubCategory created successfully",
        });
      } else {
        res.status(400).send({ status: "Fail", message: "all field required" });
      }
    } catch (error) {
      res.status(401).send({ status: "Fail", message: "something went wrong" });
    }
  };
  static getSubCategoryList = async (req, res) => {
    const { _id } = req.user;
    const UserData = await userRegistration
      .findOne({ _id: _id })
      .select("-__v");
    if (UserData.isAdmin) {
      const categoryList = await subcategoryModel.find({isActive:true}).select("-__v");

      res.status(200).send({ status: "Success", data: categoryList });
    } else {
      const categoryList = await subcategoryModel
        .find({ isActive: true })
        .select("-__v");
      res.status(200).send({ status: "Success", data: categoryList });
    }
  };

  static deleteSubCategory = async (req, res) => {
    const { isActive, _id } = req.body;
    // if ((isActive === false) && _id) {
      try {
        await subcategoryModel.findByIdAndUpdate(
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

  static updateSubcategory = async (req, res) => {
    try {
      var subcategoryId = req.body._id;
      if (subcategoryId) {
        var data = {
          ...req.body,
          isActive: true
        };
        const updatedSubCategory = await subcategoryModel
          .findByIdAndUpdate(subcategoryId, { $set: data }, { new: true })
          .select("-__v"); //saving in DB
        res.status(200).send({
          status: "Success",
          message: "updated successfully",
          data: updatedSubCategory,
        });
      }
    } catch (err) {
      res.status(400).json({ status: "Fail", message: "Something went wrong" });
    }
  };

  static getSubCategoryListbyCateId = async (req, res) => {
    try {
      const { _id } = req.user;
      var categoryId = req.params.id;
      if (categoryId) {
        const categoryList = await subcategoryModel
          .find({ $and: [{ isActive: true }, { categoryById: categoryId }] })
          // .find({ isActive: true })
          .select("-__v");
        res.status(200).send({ status: "Success", data: categoryList });
      } else {
        res
          .status(400)
          .send({ status: "Fail", data: [], message: " No Data Found" });
      }
    } catch (err) {
      res.status(400).json({ status: "Fail", message: "Something went wrong" });
    }
  };
}
module.exports = subCategoryController;
