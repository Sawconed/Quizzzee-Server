import mongoose from "mongoose";

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