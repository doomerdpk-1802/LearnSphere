const { Router } = require("express");
const adminRouter = Router();

adminRouter.post("/signup", (req, res) => {
  res.send("admin signup endpoint!");
});

adminRouter.post("/login", (req, res) => {
  res.send("admin login endpoint!");
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
