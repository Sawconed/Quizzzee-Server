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
    isActive: {
        type: Boolean,
        default: true,
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        min: [6, "Title must be at least 6 characters"],
        max: [255, "Title must be at most 255 characters"],
    },
    description: {
        type: String,
        max: [255, "Description must be at most 255 characters"],
    },
    tags: {
        type: [String],
    },
    duration: {
        type: Number,
        default: 0, 
    },
    quizzzes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quizzz",
    }
 
}, { timestamps: true , collection: "quizzzies"});

export default mongoose.model("Quizzzy", quizzzySchema);