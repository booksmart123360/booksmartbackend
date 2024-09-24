const sliderModel = require("../Models//sliderModel");
const { userRegistration } = require("../Models/userModel.js");

class sliderCotroller {
  static createSlider = async (req, res) => {
    try {
      const user = await userRegistration.findOne({ _id: req.user._id });

      if (user.isAdmin) {
        const slider = new sliderModel({...req.body});
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
      const sliders = await sliderModel.find();
      return res.status(200).json({
        status: "Success",
        sliders,
      });
    } catch (error) {
      console.log(error, `getting error in getAllSliders ${error}`);
      return res.status(500).json({ status: "Fail", message: error.message });
    }
  };
}

module.exports = sliderCotroller;
