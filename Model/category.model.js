const mongoose = require("mongoose");

const Category = new mongoose.Schema(
  {
    category_name: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports=mongoose.model("Category", Category);