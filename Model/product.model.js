const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    categoryId: {
      type: Array,
      ref: "Category",
    },
    name: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports= mongoose.model("Product", Product)