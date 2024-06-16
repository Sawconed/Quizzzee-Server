import mongoose from "mongoose";

/**
 * Quizzz Schema
 * @swagger
 *   components:
 *     schemas:
 *       Quizzz:
 *         type: object
 *         required:
 *           - text
 *           - answer_fc
 *         properties:
 *           text:
 *             type: string
 *             description: Question
 *           answer_fc:
 *             type: string
 *             description: Correct answer
 *           createdAt:
 *             type: string
 *             description: Date of creation
 *           updatedAt:
 *             type: string
 *             description: Date of last update
 *         example:
 *           text: What is the capital of France?
 *           answer_fc: Paris
 *           createdAt: 2021-07-21T14:00:00.000Z
 *           updatedAt: 2021-07-21T14:00:00.000Z
 */
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
