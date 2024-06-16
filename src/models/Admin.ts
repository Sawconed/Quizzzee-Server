import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";

interface AdminModel<T extends { login: (...args: any[]) => Promise<any> }> extends Model<Document> {
    login: T['login'];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email of the admin
 *         password:
 *           type: string
 *           description: Password of the admin
 *         isActive:
 *           type: boolean
 *           description: Status of the admin
 *         isSuper:
 *           type: boolean
 *           description: Super admin status
 *         createdAt:
 *           type: string
 *           description: Date of creation
 *         updatedAt:
 *           type: string
 *           description: Date of last update
 *       example:
 *         email: admin@gmail.com
 *         password: admin123
 *         isActive: true
 *         isSuper: false
 *         createdAt: 2021-07-21T14:00:00.000Z
 *         updatedAt: 2021-07-21T14:00:00.000Z
 */
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