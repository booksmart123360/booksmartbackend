const express = require("express");
const userController = require("../Controllers/userController.js");
const checkUserAuth = require("../Middleware/authMiddleware.js");

const userRoute = express.Router();

userRoute.post('/register', userController.userRegistration);
userRoute.post('/login', userController.userLogin);
userRoute.post('/forgot', userController.userForgot);
userRoute.get('/list', checkUserAuth, userController.getUserList);
userRoute.get('/list/:id', checkUserAuth, userController.getUserById);
userRoute.get('/verifyemail', userController.verifyToken);

module.exports = userRoute;
