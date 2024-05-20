import mongoose from "mongoose";

const quizzzSchema = new mongoose.Schema({
    // origin: {
    //     type: String,
    //     required: [true, "Origin is required"],
    // },
    origin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quizzzy",
        required: [true, "Origin is required"],
    },
    question: {
        type: String,
    },
    answer: {
        type: String,
    }
});

export default mongoose.model("Quizzz", quizzzSchema);