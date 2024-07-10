import { Request, Response } from "express-serve-static-core";
import User from "../models/User";
import jwt from "jsonwebtoken";

const handleError = (err: any) => {
  let errors: { [key: string]: string } = {
    email: "",
    username: "",
    password: "",
  };

  if (err.message === "Incorrect Email") {
    errors.email = "This email is not registered!";
  }

  if (err.message === "Incorrect Password") {
    errors.password = "This password is incorrect!";
  }

  if (err.code === 11000) {
    if (err.keyValue.username)
      errors.username = "This username is already taken!";
    if (err.keyValue.email) errors.email = "This email is already taken!";
  }

  if (err.message.includes("validation failed")) {
    Object.values(err.errors).forEach((error: any) => {
      errors[error.properties.path] = error.properties.message;
    });
  }

  return errors;
};

const createToken = (
  id: string,
  role: string,
  expiresIn: number | undefined
) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY as string, {
    expiresIn,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.login(email, password);
    if (!user.isActive) {
      return res.status(403).send({
        message: "Forbidden: User is banned",
      });
    }
    const token = createToken(
      user._id,
      user.role,
      rememberMe ? 3 * 24 * 60 * 60 : 3600
    );

    // res.cookie("jwt", token, { httpOnly: true, maxAge: 60 * 60 * 1000 * (rememberMe === "true" ? 3 * 24 : 1) });

    res.status(201).json({ user_id: user._id, access: token, role: user.role });
  } catch (error) {
    const errors = handleError(error);
    res.status(400).send(errors);
  }
};

export const signup = async (req: Request, res: Response) => {
  const signupData = new User(req.body);

  try {
    const newuser = await signupData.save();

    res.status(201).json({ user: newuser._id });
  } catch (error) {
    const errors = handleError(error);
    res.status(400).send(errors);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).send("Logged out!");
};

export const forgetPassword = async (req: Request, res: Response) => {
  const { email, new_password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        message: "User not found!",
      });
    }

    if ((user as any).role !== "user") {
      return res.status(403).send({
        message: "This account is not have permission to change password!",
      });
    }

    (user as any).password = new_password;
    await user.save();

    res.status(200).send("Password updated successfully!");
  } catch (error) {
    res.status(400).send(error);
  }
}