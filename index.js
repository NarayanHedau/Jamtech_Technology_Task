const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.json());

require("./database/db");
require("./Model/category.model");
require("./Model/product.model");

const Product = mongoose.model("Product");
const Category = mongoose.model("Category");

// create Category
app.post("/create/category", async (req, res) => {
  try {
    const result = await new Category(req.body).save();
    res.send({
      code: 200,
      message: "Category Created Successfully",
      data: result,
    });
  } catch (error) {
    res.send({
      code: 400,
      message: "Unable to Create Category",
    });
  }
});

// create product
app.post("/create/product", async (req, res) => {
  try {
    let payload = {
      categoryId: req.body.categoryId,
      name: req.body.name,
    };

    const result = await new Product(payload).save();
    res.send({
      code: 200,
      message: "Product Created Successfully",
      data: result,
    });
  } catch (error) {
    res.send({
      code: 400,
      message: "Unable to Create Product",
    });
  }
});

// get All Product
app.get("/products", async (req, res) => {
  try {
    const result = await Product.find();
    res.send({
      code: 200,
      data: result,
    });
  } catch (error) {
    res.send({
      code: 400,
      message: "Unable to find Product",
    });
  }
});

// get product find by id
app.get("/getAll/product/:id", async (req, res) => {
  try {
    const result = await Product.findOne({ _id: req.params.id });
    res.send({
      code: 200,
      data: result,
    });
  } catch (error) {
    res.send({
      code: 400,
      message: "Unable to find Product",
    });
  }
});

// Product find by id and Update
app.put("/product/update/:id", async (req, res) => {
  try {
    const result = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result) {
      const resultData = await Product.findOne({ _id: req.params.id });
      res.send({
        code: 200,
        message: "Record Updated Successfully",
        data: resultData,
      });
    }
  } catch (error) {
    res.send({
      code: 400,
      message: "Unable to update record",
    });
  }
});

// Product Find by id and delete
app.delete("/product/delete/:id", async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    res.send({
      code: 200,
      message: "Record Deleted Successfully",
    });
  } catch (error) {
    res.send({
      code: 400,
      message: "Unable to Delete record",
    });
  }
});


// Search Product by product Name and Category
app.get("/product-search", async (req, res) => {
  try {
    let condition = {};

    if (req.query.category) condition.categoryId = req.query.category;

    if (req.query.product_name) condition.name = req.query.product_name;

    const result = await Product.find(condition);

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Successfully fetched records.",
      data: result,
    });
  } catch (error) {
    res.status(404).send({
      code: 400,
      message: "Unable to fetch record",
    });
  }
});


// get Product count by product name 
app.get("/product-count", async (req, res) => {
  try {
    console.log(Array.isArray(req.query.product_name));
    const condition = {};
    if (req.query.product_name) {
      if (Array.isArray(req.query.product_name)) {
        condition.name = { $in: req.query.product_name };
      } else {
        condition.name = req.query.product_name;
      }
    }
    const result = await Product.aggregate([
      { $match: condition },
      { $group: { _id: "$name", data: { $push: "$$ROOT" } } },
    ]);

    let final = {};

    result.map((item) => {
      final[item._id] = item.data.length;
    });

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Successfully retrive count of records.",
      data: final,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      code: 400,
      message: "Unable retrive count of records.",
    });
  }
});

app.listen(3333, () => {
  console.log("Port is connected on 3333");
});
