import { Request, Response } from "express-serve-static-core";
import User from "../models/User";
import jwt from "jsonwebtoken";

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

    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach((error: any) => {
            errors[error.properties.path] = error.properties.message;
        })
    }

    return errors;
}

const createToken = (id: string, expiresIn: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY as string,
        { expiresIn: expiresIn * 60 * 60 }
    );
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { rememberMe } = req.query;

    try {
        const user = await User.login(email, password);

        const token = createToken(user._id, rememberMe === 'true' ? 3 * 24 : 1); // if rememberMe is true, token expires in 3 days

        res.cookie("jwt", token, { httpOnly: true, maxAge: 60 * 60 * 1000 * (rememberMe === "true" ? 3 * 24 : 1) });

        res.status(201).json({ user: user._id });
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