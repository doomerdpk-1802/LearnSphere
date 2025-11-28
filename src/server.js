const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
// require("dotenv").config({ path: "/app/secrets/.env" });

const port = process.env.PORT || 3000;
const { userRouter } = require("./routes/userRoutes");
const { adminRouter } = require("./routes/adminRoutes");
const { courseRouter } = require("./routes/courseRoutes");

const app = express();

app.use(express.json());

const allowedOrigins = [
  "https://learnsphere-vercel.deepak.cfd",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function startApplication() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Successfully connected to the Database!");
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  } catch (e) {
    console.error("Error Starting Application:", e);
  }
}

startApplication();

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed");
  process.exit(0);
});
