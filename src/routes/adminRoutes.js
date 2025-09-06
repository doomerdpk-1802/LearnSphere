const { Router, application } = require("express");
const adminRouter = Router();
const { schemaUser } = require("../validators/ValidateUser");
const { adminModel, coursesModel } = require("../db/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const { schemaCourse } = require("../validators/validateCourse");

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

    const token = jwt.sign({ adminId: foundAdmin._id }, JWT_SECRET_ADMIN);

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

adminRouter.use(adminMiddleware);

adminRouter.post("/create-course", async (req, res) => {
  const validCourse = schemaCourse.safeParse(req.body);

  if (validCourse.success) {
    try {
      const { title, description, price, imageUrl } = req.body;
      await coursesModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId: req.adminId,
      });

      res.status(201).json({
        message: "Course created successfully!",
      });
    } catch (e) {
      console.error("Error Creating Course:", e);
      res.status(500).json({
        error: "Error Creating Course!",
      });
    }
  } else {
    res.status(400).json({
      error: validCourse.error,
    });
  }
});

adminRouter.put("/update-course", async (req, res) => {
  const validCourse = schemaCourse.safeParse(req.body);
  if (!validCourse.success) {
    return res.status(400).json({
      error: validCourse.error,
    });
  }
  try {
    const { courseId, title, description, price, imageUrl } = req.body;
    await coursesModel.findByIdAndUpdate(courseId, {
      title,
      description,
      price,
      imageUrl,
    });

    const foundCourse = await coursesModel.findById(courseId);
    if (!foundCourse) {
      return res.status(404).json({
        error: "Course not found!",
      });
    }

    if (foundCourse.creatorId.toString() !== req.adminId) {
      return res.status(401).json({
        error: "Unauthorized!",
      });
    }
    res.status(200).json({
      message: "Course updated successfully!",
    });
  } catch (e) {
    console.error("Error Updating Course:", e);
    res.status(500).json({
      error: "Error Updating Course!",
    });
  }
});

adminRouter.get("/my-courses", async (req, res) => {
  try {
    const courses = await coursesModel.find({ creatorId: req.adminId });
    if (courses.length == 0) {
      res.status(200).json({
        message: "No courses found!",
      });
    } else {
      res.status(200).json({
        courses,
      });
    }
  } catch (e) {
    console.error("Error Fetching Courses:", e);
    res.status(500).json({
      error: "Error Fetching Courses!",
    });
  }
});

adminRouter.delete("/delete-course", async (req, res) => {
  try {
    const courseId = req.body.courseId;

    const foundCourse = await coursesModel.findById(courseId);
    if (!foundCourse) {
      return res.status(404).json({
        error: "Course not found!",
      });
    }

    if (foundCourse.creatorId.toString() !== req.adminId) {
      return res.status(401).json({
        error: "Unauthorized!",
      });
    }

    await coursesModel.findByIdAndDelete(courseId);

    return res.status(200).json({
      message: "Course deleted successfully!",
    });
  } catch (e) {
    console.error("Error Deleting Course:", e);
    return res.status(500).json({
      error: "Error Deleting Course!",
    });
  }
});

adminRouter.get("/me", async (req, res) => {
  try {
    const admin = await adminModel.findOne({
      _id: req.adminId,
    });

    res.status(200).json({
      message: "Hello " + admin.firstName + " " + admin.lastName,
    });
  } catch (e) {
    console.error("Error fecthing user", e);
    res.status(500).json({
      error: "Error fecthing user",
    });
  }
});

module.exports = {
  adminRouter,
};
