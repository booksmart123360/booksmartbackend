const jwt = require("jsonwebtoken");
const { userRegistration } = require("../Models/userModel.js");


const checkUserAuth = async(req,res,next)=>{
let token;
const { authorization } = req.headers;

if (authorization && authorization.startsWith('Bearer ')){
    try {
        token = authorization.split(' ')[1];
        // const JWT_SECRET_KEY ="kjkjskdjkjkahhiousda"
        //let jwtSecretKey="kjhesfhjkhdfsjkhesf32422323"
        let jwtSecretKey= "process.env.";
        const { userID } = jwt.verify(token, jwtSecretKey);
        req.user = await userRegistration.findById(userID).select("-password");  
        next();      
    } catch (error) {
        res.status(401).json({ "status": "failed", "message": "Unauthorized User" });
    }
} else {
    res.status(401).json({ "status": "failed", "message": "Unauthorized User, No Token" });
}
}
module.exports=  checkUserAuth;