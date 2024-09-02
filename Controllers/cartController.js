const { userRegistration } = require( "../Models/userModel.js");
const { cartModel } = require( "../Models/cartModel.js");
const roundUpTo2 = (value) => {
  return Math.round(value * 100) / 100;
};

const taxcalculation = async (product) => {
  product.SubTotal = product.Qty * product.RetailPrice; //2*100=200 if 50%

  // get product details = require( product id
  let taxableAmount = 0;
  let taxBreakUp = [];
  let totalTax = 0;
  let amount = 0; //what is this used for
  let totalTaxRate = 0;
  let commissionBreakUp = [];

  let productMaster = await Product.findOne({ ProductID: product.ProductID });

  let chargeTaxOnProduct = productMaster.ChargeTaxOnProduct;
  let priceBasedTax = productMaster.PriceBasedTax;
  let taxInclusive = productMaster.TaxInclusive;
  let productCommissionPercentage = productMaster.CommissionBreakup.map(
    (per) => per.PercentageValue
  );

  console.log(productCommissionPercentage);

  if (productCommissionPercentage < 0) {
    commissionBreakUp.push = [
      { MerchantID: "", Percentage: 4, Amount: 4 },
      { MerchantID: "", Percentage: 96, Amount: 96 },
    ];
  }

  let subTotalWithDiscount =
    Number(product.SubTotal) - Number(product.DiscountAmount);

  let taxID = productMaster.TaxID;
  let taxName = productMaster.Tax;

  if (chargeTaxOnProduct && taxID) {
    if (priceBasedTax) {
      let unitPriceAfterDiscount = roundUpTo2(
        Number(subTotalWithDiscount) / Number(product.Qty)
      );

      productMaster.TaxPriceRange.map((t) => {
        if (
          Number(unitPriceAfterDiscount) >= Number(t.Price) &&
          Number(unitPriceAfterDiscount) <= Number(t.ToPrice)
        ) {
          taxID = t.TaxID;
          return;
        }
      });
    }

    let taxfound = false;
    let customerSameState = true; //later on we will check for cus

    let tax = await Tax.findById(taxID);

    if (tax) {
      taxfound = true;
      let taxAmount = 0;
      let taxComponentTemp = [];
      tax.Taxes.map((t) => {
        if (
          customerSameState &&
          (t.TaxType === "CGST" || t.TaxType === "SGST") //9% CGST and 9% SGST within state
        ) {
          taxComponentTemp.push({
            TaxName: t.TaxName,
            TaxPercentage: Number(t.TaxPercentage),
            TaxType: t.TaxType,
            TaxAmount: 0,
          });
        } else if (!customerSameState && t.TaxType === "IGST") {
          taxComponentTemp.push({
            TaxName: t.TaxName,
            TaxPercentage: Number(t.TaxPercentage),
            TaxType: t.TaxType,
            TaxAmount: 0,
          });
        } else if (
          t.TaxType !== "CGST" &&
          t.TaxType !== "IGST" &&
          t.TaxType !== "SGST"
        ) {
          taxComponentTemp.push({
            TaxName: t.TaxName,
            TaxPercentage: Number(t.TaxPercentage),
            TaxType: t.TaxType,
            TaxAmount: 0,
          });
        }
      });

      if (taxInclusive) {
        //tax inclusive  then amount is chargable

        taxComponentTemp.map((t) => {
          totalTaxRate = roundUpTo2(
            Number(t.TaxPercentage) + Number(totalTaxRate)
          );
        });

        totalTax = roundUpTo2(
          (Number(subTotalWithDiscount) * Number(totalTaxRate)) /
            (100 + Number(totalTaxRate))
        );

        taxableAmount = roundUpTo2(
          Number(subTotalWithDiscount) - Number(totalTax)
        );

        amount = roundUpTo2(subTotalWithDiscount);

        taxComponentTemp.map((t) => {
          taxAmount = roundUpTo2(
            (Number(totalTax) *
              ((Number(t.TaxPercentage) * 100) / Number(totalTaxRate))) /
              100
          );

          taxBreakUp.push({
            Tax: t.TaxName,
            TaxPercentage: Number(t.TaxPercentage),
            TaxAmount: taxAmount,
          });
        });
      } else {
        taxableAmount = subTotalWithDiscount;
        taxComponentTemp.map((t) => {
          totalTaxRate = roundUpTo2(
            Number(t.TaxPercentage) + Number(totalTaxRate)
          );

          taxAmount = roundUpTo2(
            (Number(taxableAmount) * Number(t.TaxPercentage)) / 100
          );

          totalTax = roundUpTo2(Number(totalTax) + Number(taxAmount));

          taxBreakUp.push({
            Tax: t.TaxName,
            TaxPercentage: Number(t.TaxPercentage),
            TaxAmount: taxAmount,
          });
        });
        amount = roundUpTo2(taxableAmount + totalTax);
      }
    }
    //tax is not found then
    if (!taxfound) {
      //alert("Tax not found for selected product. Please check item ")
      taxableAmount = 0;
      taxBreakUp = [];
      totalTax = 0;
      amount = subTotalWithDiscount;
    }
  } else {
    taxableAmount = 0;
    taxBreakUp = [];
    totalTax = 0;
    amount = subTotalWithDiscount;
  }
  product.Amount = amount;
  product.TaxAmount = totalTax;
  product.TaxBreakUp = taxBreakUp;
  product.TaxPercentage = totalTaxRate;
  product.BaseAmount = taxableAmount;
  product.TaxID = taxID;
  product.Tax = taxName;
  product.TaxInclusive = taxInclusive;
  product.BasePrice = roundUpTo2(Number(taxableAmount) / Number(product.Qty));
  return product;
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

      for (let i = 0; i < cart.Products.length; i++) {
        //cart.Products[i] = await taxcalculation(cart.Products[i]);

        const product = cart.Products[i];
        product.SubTotal = product.Qty * product.MRP; //2*100=200 if 50%

        if (product && product.SubTotal !== undefined) {
          cart.Subtotal += product.SubTotal;
        }

        // if (product && product.DiscountAmount !== undefined) {
        //   cart.DiscountAmount += product.DiscountAmount;
        // }
        // if (product && product.TaxAmount !== undefined) {
        //   cart.TaxAmount += product.TaxAmount;
        // }
      }

      // console.log("Subtotal:", cart.Subtotal);
      // console.log("Discount Amount:", cart.DiscountAmount);
      // console.log("Tax Amount:", cart.TaxAmount);

      // Calculate AdditionalCharges based on Addcharges
      //const cartsubtotal = cart.Subtotal;
      //   const cartAdditionalCharges = [];

      // Handle DeliveryCharges
      //   if (Array.isArray(Addcharges.DeliveryCharges)) {
      //     const applicableDeliveryCharges = Addcharges.DeliveryCharges.filter(
      //       (charge) => {
      //         return (
      //           cartsubtotal >= charge.OrderValue= require( &&
      //           cartsubtotal <= charge.OrderValueTo
      //         );
      //       }
      //     );
      //     applicableDeliveryCharges.forEach((charge) => {
      //       cartAdditionalCharges.push({
      //         Type: "DeliveryCharge",
      //         Amount: charge.DeliveryCharge,
      //         Notes: charge.Notes,
      //       });
      //     });
      //   } else {
      //     if (Addcharges && Addcharges.DeliveryCharges) {
      //       cartAdditionalCharges.push({
      //         Type: "DeliveryCharge",
      //         Amount: Addcharges.DeliveryCharges.DeliveryCharge,
      //         Notes: Addcharges.DeliveryCharges.Notes,
      //       });
      //     }
      // }

      // Handle PackagingCharges
      //   if (Addcharges.PackagingCharges) {
      //     let packagingChargeAmount = 0;
      //     if (Addcharges?.PackagingCharges.Percentage) {
      //       // Calculate packaging charge amount based on percentage of total cart subtotal
      //       packagingChargeAmount =
      //         cartsubtotal * (Addcharges.PackagingCharges.Percentage / 100);
      //       packagingChargeAmount = Math.round(packagingChargeAmount * 100) / 100;
      //     } else {
      //       // Use fixed amount
      //       packagingChargeAmount = Addcharges?.PackagingCharges.Amount;
      //     }
      //     cartAdditionalCharges.push({
      //       Type: "PackagingCharge",
      //       Amount: packagingChargeAmount,
      //       Notes: Addcharges.PackagingCharges.Notes,
      //     });
      //   }

      //cart.AdditionalCharges = cartAdditionalCharges;

      //   let additionalChargesTotal = 0;
      //   if (Array.isArray(cart.AdditionalCharges)) {
      //     for (let i = 0; i < cart.AdditionalCharges.length; i++) {
      //       const charge = cart.AdditionalCharges[i];
      //       if (charge && charge.Amount) {
      //         additionalChargesTotal += charge.Amount;
      //       }
      //     }
      //   }

      const finalAmount = cart.Subtotal;

      // Update the cart Amount
      cart.Amount = roundUpTo2(Number(finalAmount));

      await cart.save();

      return res
        .status(200)
        .json({ code: "0", message: "Cart updated successfully", data: cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ code: "1", message: error.message });
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
