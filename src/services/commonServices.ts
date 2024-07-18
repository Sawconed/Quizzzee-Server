import { Request, Response } from "express-serve-static-core";
import User from "../models/User";
import jwt from "jsonwebtoken";
import passport from "passport";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        const Id: string = profile.id;
        const email: string = profile.emails[0].value;
        const username: string = profile.name.givenName.replace(/\s/g, "");
        const profilePic: string = profile.photos[0].value;

        const currentUser = await User.findOne({ googleId: Id });
        if (!currentUser) {
          const newUser = await new User({
            googleId: Id,
            username: username,
            email: email,
            isGoogleAccount: true,
            image: profilePic,
          }).save();

          done(null, newUser);
        } else {
          done(null, currentUser);
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        done(error, null);
      }
    }
  )
);

export const googleAuthenticate = passport.authenticate("google", {
  scope: ["profile", "email"],
  accessType: "offline",
});

interface myUser {
  _id: string;
  username: string;
  role: string;
}

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as myUser | undefined;
    // console.log(user?._id);

    const accessToken = createToken(user?._id, user?.role, 3 * 60 * 60 * 1000);
    const refreshToken = createToken(
      user?._id,
      user?.role,
      6 * 30 * 24 * 60 * 60 * 1000 // 6 months
    );

    // Set refreshToken in a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // 6 month
    });

    // Redirect to the frontend with the access token
    res.redirect(
      `http://localhost:3000/google?token=${accessToken}&user=${user?._id}`
    );
  } catch (error) {
    res.status(400).json(error);
  }
};

// Refresh the access token
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_KEY as string,
      (err: any, decoded: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res
              .status(403)
              .send({ message: "Forbidden: Token expired" });
          }
          return res
            .status(401)
            .send({ message: "Unauthorized: Invalid token" });
        }
        // console.log(decoded);
        const accessToken = createToken(
          decoded.id,
          decoded.role,
          3 * 60 * 60 * 1000
        );
        res.status(201).json({ accessToken: accessToken });
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
};

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
  id: string | undefined,
  role: string | undefined,
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
        message: "This account does not have permission to change password!",
      });
    }

    (user as any).password = new_password;
    await user.save();

    res.status(200).send("Password updated successfully!");
  } catch (error) {
    res.status(400).send(error);
  }
};
