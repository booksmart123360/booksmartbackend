const express = require("express");
const checkUserAuth =require( "../Middleware/authMiddleware.js");
const sliderController = require("../Controllers/sliderController.js")
const sliderRoute = express.Router();

sliderRoute.post('/create', checkUserAuth, sliderController.createSlider);
sliderRoute.get('/list', sliderController.getAllSliders);
sliderRoute.get('/one/:id', sliderController.getOnneSlider);

module.exports = sliderRoute;