const  { userRegistration } = require("../Models/userModel.js");
const Jwt = require("jsonwebtoken") ;
const { sendEmail } = require("../Utils/mailer.js");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

class userController {
  static userRegistration = async (req, res) => {
    try {
      var userdata = req.body;
      var afterProcessUser;
         if (
        userdata.firstname &&
        userdata.lastname &&
        userdata.email &&
        userdata.pincode &&
        userdata.address &&
        userdata.password &&
        userdata.phoneNO
      ) {
        const existingUserVerifiedByPhone = await userRegistration.findOne({
          phoneNO: userdata.phoneNO,
          isVerified: true,
        });
        if (existingUserVerifiedByPhone) {
          return res
            .status(400)
            .send({ status: "Fail", message: "Phone No. is already taken" });
        }
        const existingUserByEmail = await userRegistration.findOne({
          email: userdata.email,
        });

        if (existingUserByEmail) {
          if (existingUserByEmail.isVerified) {
            return res.status(400).send({
              status: "Fail",
              message: "User already exist with this email",
            });
          } else {
            const hashPassword = await bcrypt.hash(userdata.password, 10);
            existingUserByEmail.password = hashPassword;
            existingUserByEmail.firstname = userdata.firstname;
            existingUserByEmail.lastname = userdata.lastname;
            existingUserByEmail.pincode = userdata.pincode;
            existingUserByEmail.address = userdata.address;
            existingUserByEmail.phoneNO = userdata.phoneNO;
            await existingUserByEmail.save();
            afterProcessUser = existingUserByEmail;
            // await sendEmail({
            //   email: existingUserByEmail.email,
            //   emailType: "VERIFY",
            //   userId: existingUserByEmail._id,
            // });
            // const JWTSecreteKey = process.env.JWT_SECRETEKEY;
            // const token = Jwt.sign({ userID: existingUserByEmail._id }, JWTSecreteKey, {
            //   expiresIn: "5d",
            // });
            // const user = await userRegistration
            //   .findOne({ _id: existingUserByEmail._id })
            //   .select("-password -__v");

            // return res.status(200).send({
            //   status: "Success",
            //   message: "User register successfully",
            //   accessToken: token,
            //   data: user,
            // });
          }
        } else {
          const hashPassword = await bcrypt.hash(userdata.password, 10);
          userdata.password = hashPassword;
          const newUser = new userRegistration(userdata);
          await newUser.save();
          afterProcessUser = newUser;
          // await sendEmail({
          //   email: newUser.email,
          //   emailType: "VERIFY",
          //   userId: newUser._id,
          // });
          // const JWTSecreteKey = process.env.JWT_SECRETEKEY;
          // const token = Jwt.sign({ userID: newUser._id }, JWTSecreteKey, {
          //   expiresIn: "5d",
          // });
          // const user = await userRegistration
          //   .findOne({ _id: newUser._id })
          //   .select("-password -__v");
          
          // return res.status(200).send({
          //   status: "Success",
          //   message: "User register successfully",
          //   accessToken: token,
          //   data: user,
          // });
        }
        await sendEmail({
          email: afterProcessUser.email,
          emailType: "VERIFY",
          userId: afterProcessUser._id,
        });
        //const JWTSecreteKey = process.env.TOKEN_SECRET;
        const JWTSecreteKey = "process.env.";
        const token = Jwt.sign(
          { userID: afterProcessUser._id },
          JWTSecreteKey,
          {
            expiresIn: "5d",
          }
        );
        const user = await userRegistration
          .findOne({ _id: afterProcessUser._id })
          .select("-password -__v");
        return res.status(200).send({
          status: "Success",
          message: "User register successfully",
          accessToken: token,
          data: user,
        });
      } else {
        return res
          .status(400)
          .send({ status: "Fail", message: "all field required" });
      }
    } catch (error) {
      console.log("Error registering user ", error);
      return res
        .status(500)
        .send({ status: "Fail", message: "Error registering user" });
    }
  };

  // static userRegistration = async (req, res) => {
  //   try {
  //     var userdata = req.body;
  //     if (
  //       userdata.firstname &&
  //       userdata.lastname &&
  //       userdata.email &&
  //       userdata.pincode &&
  //       userdata.address &&
  //       userdata.password &&
  //       userdata.phoneNO
  //     ) {
  //       const user = await userRegistration.findOne({
  //         $or: [{ email: userdata.email }, { phoneNO: userdata.phoneNO }],
  //       });
  //       if (!user) {
  //         userdata.isAdmin = false;
  //         const userdocument = new userRegistration(userdata);
  //         await userdocument.save();
  //         const JWTSecreteKey = "kjhesfhjkhdfsjkhesf32422323";
  //         const token = Jwt.sign({ userID: userdocument._id }, JWTSecreteKey, {
  //           expiresIn: "5d",
  //         });
  //         const Userdata = await userRegistration
  //           .findOne({ _id: userdocument._id })
  //           .select("-password -__v");

  //         res.status(200).send({
  //           status: "Success",
  //           message: "User register successfully",
  //           accessToken: token,
  //           data: Userdata,
  //         });
  //         await sendEmail({
  //           email: Userdata.email,
  //           emailType: "VERIFY",
  //           userId: Userdata._id,
  //         });
  //       } else {
  //         res.status(400).send({
  //           status: "Fail",
  //           message: "Email or Phone no. already exist",
  //         });
  //       }
  //       // res.status(200).send({status:"success",message:"user register successfully"})
  //     } else {
  //       res.status(400).send({ status: "Fail", message: "all field required" });
  //     }
  //   } catch (error) { }
  //   // console.log(userdata);
  // };
  static userLogin = async (req, res) => {
    const { email, password } = req.body;
    const existUser = await userRegistration.findOne({ email: email });
    const validPassword = await bcrypt.compare(password, existUser.password);

    if (email && password) {
      if (existUser.isVerified) {
        if (validPassword) {
          //const JWTSecreteKey = process.env.TOKEN_SECRET;
          const JWTSecreteKey = "process.env.";
          const token = Jwt.sign({ userID: existUser._id }, JWTSecreteKey, {
            expiresIn: "5d",
          });
          const User = await userRegistration
            .findOne({ _id: existUser._id })
            .select("-password -__v");
          res.status(200).send({
            status: "Success",
            message: "User login successfully",
            accessToken: token,
            data: User,
          });
        } else {
          res.status(400).send({
            status: "Fail",
            message: "Your email or password are Wrong",
          });
        }
      } else {
        res
          .status(400)
          .send({
            status: "Fail",
            message: "You are not registered or verified user",
          });
      }
    } else {
      res.status(400).send({ status: "Fail", message: "All Field Required" });
    }
  };
  static userForgot = () => {};

  static getUserList = async (req, res) => {
    const { _id } = req.user;
    const UserData = await userRegistration
      .findOne({ _id: _id })
      .select("-__v");
    if (UserData.isAdmin) {
      const existUserList = await userRegistration
        .find()
        .select("-password -__v");
      res.status(200).send({ status: "Success", data: existUserList });
    } else {
      const existUserList = await userRegistration
        .find({ isVerified: true })
        .select("-__v -password");
      res.status(200).send({ status: "Success", data: existUserList });
    }
  };
  static getUserById = async (req, res) => {
    var userID = req.params.id;
    console.log(userID, req.body);
    const existUserList = await userRegistration
      .findOne({ _id: userID })
      .select("-password -__v");

    if (existUserList) {
      res.status(200).send({ status: "Success", data: existUserList });
    } else {
    }
  };

  static verifyToken = async (req, res) => {
    try {
      const token = await req.query.token;
      const user = await userRegistration.findOne({
        verifyToken: token,
        verifyTokenExpiry: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).send({
          status: "Fail",
          message: "Invalid token",
        });
      }

      user.isVerified = true;
      user.verifyToken = undefined;
      user.verifyTokenExpiry = undefined;
      await user.save();
      res.status(200).render("verifyEmail");
      // return res.send({
      //   message: "Email verified successfully",
      //   success: true,
      // });
    } catch (error) {
      return res.status(400).send({ error: error.message }, { status: 500 });
    }
  };
}
module.exports = userController;
