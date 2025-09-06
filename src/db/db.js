const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const adminSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const coursesSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true, trim: true },
    creatorId: { type: ObjectId },
  },
  { timestamps: true }
);

const purchasesSchema = new Schema(
  {
    courseId: { type: ObjectId },
    userId: { type: ObjectId },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const coursesModel = mongoose.model("courses", coursesSchema);
const purchasesModel = mongoose.model("purchases", purchasesSchema);

module.exports = {
  userModel,
  adminModel,
  coursesModel,
  purchasesModel,
};
