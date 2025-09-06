const { Router } = require("express");
const userRouter = Router();
const { schemaUser } = require("../validators/ValidateUser");
const { userModel } = require("../db/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET_USER = process.env.JWT_SECRET_USER;

userRouter.post("/signup", async (req, res) => {
  const validUser = schemaUser.safeParse(req.body);

  if (validUser.success) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const hashedpassword = await bcrypt.hash(password, saltRounds);
      await userModel.create({
        firstName,
        lastName,
        email,
        password: hashedpassword,
      });

      res.status(201).json({
        message: "user signed-up successfully!",
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

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await userModel.findOne({
      email,
    });

    if (!foundUser) {
      res.status(404).json({
        error: "User doesn't exist!",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      res.json(401).json({
        error: "Invalid Credientials!",
      });
    }

    const token = jwt.sign({ userId: foundUser._id }, JWT_SECRET_USER);

    res.status(200).json({
      message: "user logged-in successfully",
      token,
    });
  } catch (e) {
    console.error("Error Logging in:", e);
    res.status(500).json({
      error: "Error Logging in!",
    });
  }
});

userRouter.post("/purchase-course", (req, res) => {
  res.send("user purchase-course endpoint!");
});

userRouter.get("/my-courses", (req, res) => {
  res.send("user my-courses endpoint!");
});

userRouter.get("/me", (req, res) => {
  res.send("user me endpoint!");
});

module.exports = {
  userRouter,
};
