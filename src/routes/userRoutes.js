const { Router, application } = require("express");
const userRouter = Router();
const { schemaUser } = require("../validators/ValidateUser");
const { userModel, coursesModel, purchasesModel } = require("../db/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET_USER = process.env.JWT_SECRET_USER;
const { userMiddleware } = require("../middlewares/userMiddleware");

if (!JWT_SECRET_USER) {
  throw new Error("JWT_SECRET_USER is not defined in environment variables");
}

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
    res.status(400).json({ error: validUser.error.errors });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await userModel.findOne({
      email,
    });

    if (!foundUser) {
      return res.status(404).json({
        error: "User doesn't exist!",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
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

userRouter.use(userMiddleware);

userRouter.post("/purchase-course", async (req, res) => {
  try {
    const { courseId } = req.body;
    const foundCourse = await coursesModel.findById(courseId);
    if (!foundCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    await purchasesModel.create({ courseId, userId: req.userId });
    res.status(200).json({
      message: "Course purchased successfully!",
    });
  } catch (e) {
    console.error("Error Purchasing Course:", e);
    res.status(500).json({
      error: "Error Purchasing Course!",
    });
  }
});

userRouter.get("/my-purchased-courses", async (req, res) => {
  try {
    const purchasedCourses = await purchasesModel
      .find({ userId: req.userId })
      .populate("courseId");

    if (purchasedCourses.length === 0) {
      return res.status(200).json({
        message: "No purchased courses found!",
        purchasedCourses: [],
      });
    }

    const courses = purchasedCourses.map((purchase) => purchase.courseId);

    res.status(200).json({
      purchasedCourses: courses,
    });
  } catch (e) {
    console.error("Error Fetching Purchased Courses:", e);
    res.status(500).json({
      error: "Error Fetching Purchased Courses!",
    });
  }
});

userRouter.get("/me", async (req, res) => {
  try {
    const user = await userModel.findOne({
      _id: req.userId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Hello " + user.firstName + " " + user.lastName,
    });
  } catch (e) {
    console.error("Error fetching user", e);
    res.status(500).json({
      error: "Error fetching user",
    });
  }
});

module.exports = {
  userRouter,
};
