import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";

interface UserModel<T extends { login: (...args: any[]) => Promise<any> }> extends Model<Document> {
    login: T['login'];
}


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        validate: {
            validator: (v: string) => {
                return /^[a-zA-Z0-9_]{3,20}$/.test(v); // 3-20 characters, letters, numbers, and underscores only
            },
            message: (props: any) => `${props.value} is not a valid username!`
        },
        lowercase: true,
        unique: true
    },
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
    firstName: {
        type: String,
        trim: true,
        validate: {
            validator: (v: string) => {
                return /^[a-zA-Z]{1,20}$/.test(v); // 1-20 characters, letters only
            },
            message: (props: any) => `${props.value} is not a valid first name!`
        },
        lowercase: true
    },
    lastName: {
        type: String,
        trim: true,
        validate: {
            validator: (v: string) => {
                return /^[a-zA-Z]{1,20}$/.test(v); // 1-20 characters, letters only
            },
            message: (props: any) => `${props.value} is not a valid last name!`
        },
        lowercase: true
    },
    birthDate: {
        type: String,
        validate: {
            validator: (v: string) => {
                return /^\d{4}-\d{2}-\d{2}$/.test(v); // Date format
            },
            message: (props: any) => `${props.value} is not a valid date!`
        },
    },
    image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    favorites: {
        type: [String],
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

userSchema.static("login", async function (email: string, password: string) {
    const user = await this.findOne({ email });

    if (user) {
        const auth = await bcrypt.compare(password, user.password);

        if (auth) {
            return user;
        }

        throw Error("Incorrect Password");
    }

    throw Error("Incorrect Email");
});

// const User = mongoose.model("User", userSchema);

const User = mongoose.model<Document, UserModel<{ login: (...args: any[]) => Promise<any> }>>('User', userSchema);


export default User;