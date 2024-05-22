import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";

interface AdminModel<T extends { login: (...args: any[]) => Promise<any> }> extends Model<Document> {
    login: T['login'];
}

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

adminSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

adminSchema.static("login", async function (email: string, password: string) {
    const admin = await this.findOne({ email });

    if (admin) {
        const auth = await bcrypt.compare(password, admin.password);

        if (auth) {
            return admin;
        }

        throw Error("Incorrect Password");
    }

    throw Error("Incorrect Email");
})

const Admin = mongoose.model<Document, AdminModel<{ login: (...args: any[]) => Promise<any> }>>('Admin', adminSchema);

export default Admin;