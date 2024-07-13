import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import cookieSession from "cookie-session";
import passport from "passport";

import commonRoutes from "./routes/commonRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import quizzzyRoutes from "./routes/quizzzyRoutes";
import quizzzRoutes from "./routes/quizzzRoutes";
import reportRoutes from "./routes/reportRoutes";

import { swaggerDocs } from "./utils/swagger";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

// app.use(
//   cookieSession({
//     maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
//     keys: ["cat"],
//   })
// );

// app.use(function (request: any, response: any, next) {
//   if (request.session && !request.session.regenerate) {
//     request.session.regenerate = (cb: any) => {
//       cb();
//     };
//   }
//   if (request.session && !request.session.save) {
//     request.session.save = (cb: any) => {
//       cb();
//     };
//   }
//   next();
// });

// Initialize passport
app.use(passport.initialize());
// app.use(passport.session());

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI as string;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB 🪿");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT} 🚀`);
    });

    swaggerDocs(app, PORT);

    app.use("/api/commons", commonRoutes);

    app.use("/api/users", userRoutes);

    app.use("/api/admins", adminRoutes);

    app.use("/api/quizzzy", quizzzyRoutes);

    app.use("/api/quizzz", quizzzRoutes);

    app.use("/api/report", reportRoutes);

    app.use((req, res) => {
      res.status(404).send("404 Not Found");
    });
  })
  .catch((error) => {
    console.error(error);
  });
