import mongoose from "mongoose";

const quizzzSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Please provide a question"],
      minLength: [6, "Question must be at least 6 characters"],
      maxLength: [255, "Question must be at most 255 characters"],
    },
    answer_fc: {
      type: String,
      required: [true, "Please provide a correct answer"],
      minLength: [2, "Answer must be at least 2 characters"],
      maxLength: [255, "Answer must be at most 255 characters"],
    },
  },
  { timestamps: true, collection: "quizzzes" }
);

const Quizzz = mongoose.model("Quizzz", quizzzSchema);

export default Quizzz;
