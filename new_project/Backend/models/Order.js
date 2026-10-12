const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rr_is_user_collection",
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
    order_details: {
      type: [
        {
          product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "rr_is_product_collection",
            required: true,
          },
          product_title: {
            type: String,
            required: true,
          },
          product_price: {
            type: Number,
            required: true,
          },
          product_quantity: {
            type: Number,
            required: true,
          },
          product_image: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile_no: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.index({razorpay_payment_id:"text",razorpay_order_id:"text",name:"text",email:"text",mobile_no:"text",address:"text",city:"text",state:"text",pincode:"text"})

const OrderModel = mongoose.model("rr_is_order_collection", orderSchema);
module.exports = OrderModel;
