import mongoose from "mongoose";

const notEmpty = (arr: any[]) => {
  if (arr.length === 0) {
    return false;
  } else {
    return true;
  }
};

const quizzzySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [6, "Title must be at least 6 characters"],
      maxLength: [255, "Title must be at most 255 characters"],
    },
    description: {
      type: String,
      maxLength: [255, "Description must be at most 255 characters"],
    },
    tags: {
      type: [String],
    },
    duration: {
      type: Number,
      default: 0,
    },
    quizzzes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Quizzz",
      validate: {
        validator: (v: any) => notEmpty(v),
        message: "Quizzzy must have at least one quizz",
      },
    },
  },
  { timestamps: true, collection: "quizzzies" }
);

const Quizzzy = mongoose.model("Quizzzy", quizzzySchema);

export default Quizzzy;
