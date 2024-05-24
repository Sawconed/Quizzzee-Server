import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header is present and formatted correctly
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
    console.log(err);
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).send({ message: "Forbidden: Token expired" });
      }
      // Handle other JWT verification errors
      return res.status(401).send({ message: "Unauthorized: Invalid token" });
    }

    // If token is valid, attach decoded payload (user information) to the request object

    req.body = decoded;
    next(); // Allow the request to proceed
  });
};
