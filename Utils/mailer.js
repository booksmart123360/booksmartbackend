const nodemailer = require("nodemailer");
const { userRegistration } = require("../Models/userModel.js");
const path = require("path");
const bcryptjs = require("bcryptjs");
const ejs = require("ejs");
const fs = require("fs");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Function to send email
module.exports.sendEmail = async ({ email, emailType, userId }) => {
  try {
    // Create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Update user record with token information based on email type
    if (emailType === "VERIFY") {
      await userRegistration.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
        },
      });
    } else if (emailType === "RESET") {
      await userRegistration.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour expiry
        },
      });
    }

    // Use __dirname to get the template path
    const templatePath = path.join(__dirname, "..", "Views", "verifyEmailContent.ejs");
    const templateString = fs.readFileSync(templatePath, "utf8");

    // Create mail transport configuration
    const transport = nodemailer.createTransport({
      //service: "gmail",
      //host: "smtp.gmail.com",
      // port: 587,
      // secure: false, // True for 465, false for other ports
      // auth: {
      //   user: process.env.EMAIL_USER, // Ensure this environment variable is set
      //   pass: process.env.EMAIL_PASSWORD, // Ensure this environment variable is set
      // },
      host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'delphia.gutkowski41@ethereal.email',
        pass: 'zJ6y7bYcs2xcxSKBzP'
    }
    });

    // Create verification link
    const verificationLink = `${process.env.DOMAIN}/api/user/verifyemail?token=${hashedToken}`;

    // Define mail options
    const mailOptions = {
      from: {
        name: "BookMart",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: ejs.render(templateString, {
        emailType: emailType,
        verificationLink: verificationLink,
      }),
    };

    // Send email
    const mailResponse = await transport.sendMail(mailOptions);
    console.log(mailResponse);
    return mailResponse;

  } catch (error) {
    console.error("Error sending email:", error);
    //throw new Error(error.message);
  }
};







// const nodemailer require( "nodemailer";
// const { userRegistration } require( "../Models/userModel.js";
// const { fileURLToPath } require( "url";
// const { dirname } require( "path";
// const path require( "path";
// const bcryptjs require( "bcryptjs";
// const ejs require( "ejs";
// const fs require( "fs";
// // const dotenv require( "dotenv";
// // dotenv.config();

// export const sendEmail = async ({ email, emailType, userId }) => {
//   try {
//     // create a hased token
//     const hashedToken = await bcryptjs.hash(userId.toString(), 10);
//     if (emailType === "VERIFY") {
//       await userRegistration.findByIdAndUpdate(userId, {
//         $set: {
//           verifyToken: hashedToken,
//           verifyTokenExpiry: Date.now() + 3600000,
//         },
//       });
//     } else if (emailType === "RESET") {
//       await userRegistration.findByIdAndUpdate(userId, {
//         $set: {
//           forgotPasswordToken: hashedToken,
//           forgotPasswordTokenExpiry: Date.now() + 3600000,
//         },
//       });
//     }
//     const __filename = fileURLToPath(const.meta.url);
//     const __dirname = dirname(__filename);
//     const templatePath = path.join(
//       __dirname,
//       "..",
//       "Views",
//       "verifyEmailConstent.ejs"
//     );
//     const templateString = fs.readFileSync(templatePath, "utf8");
//     console.log(templateString);

//     var transport = nodemailer.createTransport({
//       host: "sandbox.smtp.mailtrap.io",
//       port: 2525,
//       auth: {
//         user: process.env.TEMP_require(_USER,
//         pass: process.env.TEMP_APP_PASSWORD,
//         // user: process.env.require(_USER,
//         // pass: process.env.APP_PASSWORD,
//       },
//     });
//     const verificationLink = `${process.env.DOMAIN}/api/user/verifyemail?token=${hashedToken}`; // Assuming your verification API endpoint

//     const mailOptions = {
//       require(: {
//         name: "BookMart",
//         address: process.env.require(_USER,
//       },
//       to: email,
//       subject:
//         emailType === "VERIFY" ? "Verify your email" : "Reset your password",
//       html: ejs.render(templateString, {
//         emailType: emailType,
//         verificationLink: verificationLink,
//       }),
//       //html: fs.readFileSync(templatePath, 'utf8')
//       // html: `<p>Click <a href="${process.env.DOMAIN}/api/user/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
//       // or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
//       // </p>`
//     };
//     const mailresponse = await transport.sendMail(mailOptions);
//     return mailresponse;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
