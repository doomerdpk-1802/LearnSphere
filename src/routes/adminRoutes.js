const { Router } = require("express");
const adminRouter = Router();
const { schemaUser } = require("../validators/ValidateUser");
const { adminModel } = require("../db/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

adminRouter.post("/signup", async (req, res) => {
  const validUser = schemaUser.safeParse(req.body);

  if (validUser.success) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const hashedpassword = await bcrypt.hash(password, saltRounds);
      await adminModel.create({
        firstName,
        lastName,
        email,
        password: hashedpassword,
      });

      res.status(201).json({
        message: "admin signed-up successfully!",
      });
    } catch (e) {
      console.error("Error Signing up:", e);
      res.status(500).json({
        error: "Error Signing Up!",
      });
    }
  } else {
    res.status(400).json({
      error: validUser.error,
    });
  }
});

adminRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundAdmin = await adminModel.findOne({
      email,
    });

    if (!foundAdmin) {
      res.status(404).json({
        error: "Admin doesn't exist!",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, foundAdmin.password);

    if (!isPasswordValid) {
      res.json(401).json({
        error: "Invalid Credientials!",
      });
    }

    const token = jwt.sign({ userId: foundAdmin._id }, JWT_SECRET_ADMIN);

    res.status(200).json({
      message: "admin logged-in successfully",
      token,
    });
  } catch (e) {
    console.error("Error Logging in:", e);
    res.status(500).json({
      error: "Error Logging in!",
    });
  }
});

adminRouter.post("/create-course", (req, res) => {
  res.send("admin create course endpoint!");
});

adminRouter.put("/update-course", (req, res) => {
  res.send("admin update-course endpoint!");
});

adminRouter.get("/my-courses", (req, res) => {
  res.send("admin my-courses endpoint!");
});

adminRouter.delete("/delete-course", (req, res) => {
  res.send("admin delete-course endpoint!");
});

adminRouter.get("/me", (req, res) => {
  res.send("admin me endpoint!");
});

module.exports = {
  adminRouter,
};
