import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        validate: {
            validator: (v: string) => {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email regex
            },
            message: (props: any) => `${props.value} is not a valid email!`
        },
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: [6, "Password must be at least 6 characters long"],
    },

    isActive: {
        type: Boolean,
        default: true,
    },
    isSuper: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);