const { Router } = require("express");
const courseRouter = Router();
const { coursesModel } = require("../db/db");

courseRouter.get("/all-courses", async (req, res) => {
  try {
    const courses = await coursesModel.find();

    if (courses.length === 0) {
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

module.exports = {
  courseRouter,
};
