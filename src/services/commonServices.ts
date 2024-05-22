import { Request, Response } from "express-serve-static-core";
import User from "../models/User";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

const handleError = (err: any) => {
    let errors: { [key: string]: string } = { email: "", username: "", password: "" };

    if (err.message === "Incorrect Email") {
        errors.email = "This email is not registered!";
    }

    if (err.message === "Incorrect Password") {
        errors.password = "This password is incorrect!";
    }

    if (err.code === 11000) {
        if (err.keyValue.username) errors.username = "This username is already taken!";
        if (err.keyValue.email) errors.email = "This email is already taken!";
    }

    if (err.message.includes("validation failed")) {
        Object.values(err.errors).forEach((error: any) => {
            errors[error.properties.path] = error.properties.message;
        })
    }

    return errors;
}

const createToken = (id: string, expiresIn: number | undefined) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY as string,
        { expiresIn }
    );
}

export const login = async (req: Request, res: Response) => {
    const { email, password, rememberMe } = req.body;

    try {
        const user = await User.login(email, password);

        const token = createToken(user._id, rememberMe ? 3 * 24 * 60 * 60 : 3600);

        // res.cookie("jwt", token, { httpOnly: true, maxAge: 60 * 60 * 1000 * (rememberMe === "true" ? 3 * 24 : 1) });

        res.status(201).json({ user_id: user._id, access: token });
    } catch (error) {
        const errors = handleError(error);
        res.status(400).send(errors);
    }
}

export const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.login(email, password);

        const token = createToken(admin._id, 3600);

        res.status(201).json({ admin_id: admin._id, access: token, isSuper: admin.isSuper });
    } catch (error) {
        const errors = handleError(error);
        res.status(400).send(errors);
    }
}

export const signup = async (req: Request, res: Response) => {
    const signupData = new User(req.body);

    try {
        const newuser = await signupData.save();

        res.status(201).json({ user: newuser._id });
    } catch (error) {
        const errors = handleError(error);
        res.status(400).send(errors);
    }
}

export const logout = async (req: Request, res: Response) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).send("Logged out!");
}