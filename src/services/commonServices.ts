import { Request, Response } from "express-serve-static-core";
import User from "../models/User";

const handleError = (err: any) => {
    let errors: { [key: string]: string } = { email: "", username: "", password: "" };

    if (err.code === 11000) {
        if (err.keyValue.username) errors.username = "This username is already taken!";
        if (err.keyValue.email) errors.email = "This email is already taken!";
    }

    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach((error: any) => {
            errors[error.properties.path] = error.properties.message;
        })
    }

    return errors;
}

export const login = async (req: Request, res: Response) => {
    res.status(201).send('Login');
}

export const signup = async (req: Request, res: Response) => {
    const signupData = new User(req.body);

    try {
        const newuser = await signupData.save();

        res.status(201).json({ user: newuser._id });
    } catch (error) {
        const errors = handleError(error);
        res.status(500).send(errors);
    }
}

export const logout = async (req: Request, res: Response) => {
    res.status(201).send('Logout');
}