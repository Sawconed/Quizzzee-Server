import mongoose from "mongoose";

const quizzzySchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: [true, "Creator is required"],
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
    },
    tags: {
        type: [String],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export default mongoose.model("Quizzzy", quizzzySchema);