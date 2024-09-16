const { userRegistration } = require("../Models/userModel.js");
const { cartModel } = require("../Models/cartModel.js");
const { productModel } = require("../Models/productModel.js");

const roundUpTo2 = (value) => {
  return Math.round(value * 100) / 100;
};

class cartController {
  static createCart = async (req, res) => {
    try {
      const Products = req.body;

      let cart = await cartModel.findOneAndUpdate(
        { CustomerID: req.user._id },
        { $set: req.body },
        { new: true }
      );

      if (!cart) {
        cart = new cartModel({
          CustomerID: req.user._id,
          Products: Products,
          ...req.body,
        });
      }

      cart.Subtotal = 0;
      cart.Amount = 0;

      for (let i = 0; i < cart.Products.length; i++) {
        const product = cart.Products[i];

        const dbProduct = await productModel.findOne({
          _id: product.ProductID,
        });

        if (dbProduct) {
          if (dbProduct.ProductPrice !== product.ProductPrice) {
            return res.status(401).json({
              status: "fail",
              message: `Product price is not matching for ${product.ProductName}`,
            });
          }
          product.ISBN = dbProduct.ISBN;
          product.AuthorName = dbProduct.AuthorName;
          product.PageNumber = dbProduct.PageNumber;
          product.HardCover = dbProduct.HardCover;
          product.categoryName = dbProduct.categoryName;
          product.categoryById = dbProduct.categoryById;
          product.subCategoryName = dbProduct.subCategoryName;
          product.subCategoryById = dbProduct.subCategoryById;
          product.Discountamount = dbProduct.Discountamount;
          product.Discountpercentage = dbProduct.Discountpercentage;
          product.ProductImage = dbProduct.ProductImage;
          product.SubTotal = product.Qty * product.ProductPrice;
          product.Amount = product.SubTotal;

          if (product && product.Discountamount !== undefined) {
            product.Amount = product.SubTotal - product.Discountamount;
            cart.Discountamount += product.Discountamount;
          }

          if (product.Paperback && product.PaperbackAmount) {
            product.PaperbackAmount = dbProduct.PaperbackAmount;
            product.Amount += product.PaperbackAmount;
          }

          cart.Subtotal += product.SubTotal;
          cart.Amount += product.Amount;
        } else {
          return res
            .status(404)
            .json({ status: "fail", message: "Product not foun" });
        }
      }

      const finalAmount = cart.Amount;

      // Update the cart Amount
      cart.Amount = roundUpTo2(Number(finalAmount));

      await cart.save();

      return res
        .status(200)
        .json({ code: "0", message: "Cart updated successfully", data: cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "fail", message: error.message });
    }
  };

  static getCartList = async (req, res) => {
    const { _id } = req.user;
    const UserData = await userRegistration
      .findOne({ _id: _id })
      .select("-__v");
    if (UserData) {
      const cartList = await cartModel.find({ CustomerID: _id }).select("-__v");
      res.status(200).send({ status: "Success", data: cartList });
    } else {
      res
        .status(400)
        .send({ status: "Fail", message: "User does not  exists " });
    }
  };
}
module.exports = cartController;
