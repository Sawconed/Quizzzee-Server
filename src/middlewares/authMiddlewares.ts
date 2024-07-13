import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { isUserBanned } from "../services/userServices";

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
    next();
  });
};

export const verifyUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.decoded && req.decoded.role === "user") {
    return next();
  } else {
    return res.status(403).send({
      message: "Unauthorized: You are not authorized to perform this operation",
    });
  }
};

export const verifyAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.decoded && req.decoded.role === "admin") {
    return next();
  } else {
    return res.status(403).send({
      message: "Unauthorized: You are not authorized to perform this operation",
    });
  }
};

export const verifySuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.decoded && req.decoded.role === "superAdmin") {
    return next();
  } else {
    return res.status(403).send({
      message: "Unauthorized: You are not authorized to perform this operation",
    });
  }
};

export const checkUserBan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await isUserBanned(req.decoded.id);

    if (user === true) {
      return next();
    } else if (user === false) {
      return res.status(403).send({
        message: "Forbidden: User is banned",
      });
    } else {
      return res.status(404).send({
        message: "Not Found: User does not exist",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message:
        "Internal Server Error: An error occurred while checking user status",
    });
  }
};
