import mongoose from "mongoose";

const notEmpty = (arr: any[]) => {
  if (arr.length === 0) {
    return false;
  } else {
    return true;
  }
};

/**
 * Quizzzy Schema
 * @swagger
 *   components:
 *     schemas:
 *       Quizzzy:
 *         type: object
 *         required:
 *           - createdBy
 *           - title
 *         properties:
 *           createdBy:
 *             type: string
 *             description: User ID
 *           isPrivate:
 *             type: boolean
 *             description: Is private
 *           isActive:
 *             type: boolean
 *             description: Is active
 *           title:
 *             type: string
 *             description: Title
 *           description:
 *             type: string
 *             description: Description
 *           tags:
 *             type: array
 *             items:
 *               type: string
 *             description: Tags
 *           duration:
 *             type: number
 *             description: Duration
 *           quizzzes:
 *             type: array
 *             items:
 *               type: string
 *             description: Quizzzes
 *           createdAt:
 *             type: string
 *             description: Date of creation
 *           updatedAt:
 *             type: string
 *             description: Date of last update
 *         example:
 *           createdBy: 60f7b3b3b5f7f00015f2b3b3
 *           isPrivate: false
 *           isActive: true
 *           title: My Quizzzy
 *           description: This is a quizzzy
 *           tags: [tag1, tag2]
 *           duration: 60
 *           quizzzes: [60f7b3b3b5f7f00015f2b3b3]
 *           createdAt: 2021-07-21T14:00:00.000Z
 *           updatedAt: 2021-07-21T14:00:00.000Z
 */
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
      default: [],
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
