const { Router } = require("express");
const userRouter = Router();

userRouter.post("/signup", (req, res) => {
  res.send("user signup endpoint!");
});

userRouter.post("/login", (req, res) => {
  res.send("user login endpoint!");
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
