import mongoose from "mongoose";

/**
 * Report Schema
 * @swagger
 *   components:
 *     schemas:
 *       Report:
 *         type: object
 *         required:
 *           - quizzzyId
 *           - createdBy
 *         properties:
 *           quizzzyId:
 *             type: string
 *             description: Quizzzy ID
 *           createdBy:
 *             type: string
 *             description: User ID
 *           message:
 *             type: string
 *             description: Message
 *           createdAt:
 *             type: string
 *             description: Date of creation
 *           updatedAt:
 *             type: string
 *             description: Date of last update
 *         example:
 *           quizzzyId: 60f7b3b3b5f7f00015f2b3b3
 *           createdBy: 60f7b3b3b5f7f00015f2b3b3
 *           message: This is a report
 *           createdAt: 2021-07-21T14:00:00.000Z
 *           updatedAt: 2021-07-21T14:00:00.000Z
 */
const reportSchema = new mongoose.Schema({
    quizzzyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quizzzy",
        required: [true, "Quizzzy ID is required"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    message: {
        type: String,
    },
}, { timestamps: true });

const Report = mongoose.model("Report", reportSchema);

export default Report;