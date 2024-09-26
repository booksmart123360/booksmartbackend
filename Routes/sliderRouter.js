const express = require("express");
const checkUserAuth =require( "../Middleware/authMiddleware.js");
const sliderController = require("../Controllers/sliderController.js")
const sliderRoute = express.Router();

sliderRoute.post('/create', checkUserAuth, sliderController.createSlider);
sliderRoute.get('/list', sliderController.getAllSliders);
sliderRoute.get('/one/:id', sliderController.getOnneSlider);
sliderRoute.put("/:id", checkUserAuth, sliderController.UpdateSlider);
sliderRoute.delete("/:id", checkUserAuth, sliderController.DeleteSlider);

module.exports = sliderRoute;