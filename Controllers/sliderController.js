const sliderModel = require("../Models//sliderModel");
const { userRegistration } = require("../Models/userModel.js");

class sliderCotroller {
  static createSlider = async (req, res) => {
    try {
      const user = await userRegistration.findOne({ _id: req.user._id });

      if (user.isAdmin) {
        const slider = new sliderModel({ ...req.body, isActive: true });
        await slider.save();

        return res.status(200).json({
          status: "Success",
          message: "slider created successfully",
          slider,
        });
      } else {
        return res.status(401).json({
          status: "fail",
          message: "you are not allowed",
        });
      }
    } catch (error) {
      console.log(error, `getting error in createSlider ${error}`);
      return res.status(500).json({ status: "Fail", message: error.message });
    }
  };

  static getOnneSlider = async (req, res) => {
    try {
      const slider = await sliderModel.findById(req.params.id);
      return res.status(200).json({
        status: "Success",
        slider,
      });
    } catch (error) {
      console.log(error, `getting error in getOnneSlider ${error}`);
      return res.status(500).json({ status: "Fail", message: error.message });
    }
  };

  static getAllSliders = async (req, res) => {
    try {
      const sliders = await sliderModel.find({isActive: true});
      return res.status(200).json({
        status: "Success",
        sliders,
      });
    } catch (error) {
      console.log(error, `getting error in getAllSliders ${error}`);
      return res.status(500).json({ status: "Fail", message: error.message });
    }
  };

  static UpdateSlider = async (req, res) => {
    try {
      var sliderData = req.body;
      const updatedSlider = await sliderModel
        .findByIdAndUpdate(
          req.params.id,
          { $set: { ...sliderData } },
          { new: true }
        )
        .select("-__v"); //saving in DB
      res.status(200).send({
        status: "Success",
        message: "updated successfully",
        data: updatedSlider,
      });
    } catch (error) {
      console.log(error, `getting error in UpdateSlider ${error}`);
      return res.status(500).json({ status: "Fail", message: error.message });
    }
  };

  static DeleteSlider = async (req, res) => {
    try {
      await sliderModel
        .findByIdAndUpdate(
          req.params.id,
          { $set: { isActive: false } },
          { new: true }
        )
        .select("-__v"); //saving in DB
      res.status(200).send({
        status: "Success",
        message: "Delete successfully"
      });
    } catch (error) {
      console.log(error, `getting error in DeleteSlider ${error}`);
      return res.status(500).json({ status: "Fail", message: error.message });
    }
  };
}

module.exports = sliderCotroller;
