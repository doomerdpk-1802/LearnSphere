const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT;
const { userRouter } = require("./routes/userRoutes");
const { adminRouter } = require("./routes/adminRoutes");
const { courseRouter } = require("./routes/courseRoutes");
const {
  userModel,
  adminModel,
  coursesModel,
  purchasesModel,
} = require("./db/db");

const app = express();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function startApplication() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Successfully connected to the Database!");
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  } catch (e) {
    console.log("Error Starting Application:" + e);
  }
}

startApplication();
