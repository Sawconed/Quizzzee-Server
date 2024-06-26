import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

interface AuthenticatedRequest extends Request {
  decoded?: any;
}

export const verifyJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Unauthorized: Missing or invalid token" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).send({ message: "Forbidden: Token expired" });
      }
      return res.status(401).send({ message: "Unauthorized: Invalid token" });
    }
    req.decoded = decoded;
    console.log(req.body);
    next();
  });
};

export const verifyUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.decoded && req.decoded.role === "user") {
    return next();
  } else {
    return res
      .status(403)
      .send({
        message:
          "Unauthorized: You are not authorized to perform this operation",
      });
  }
};
