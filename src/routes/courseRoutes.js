const { Router } = require("express");
const courseRouter = Router();

courseRouter.get("/all-courses", (req, res) => {
  res.send("all courses endpoint");
});

module.exports = {
  courseRouter,
};
