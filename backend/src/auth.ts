import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();
const jwtKey = process.env.JWT_KEY;

if (!jwtKey) {
  throw new Error("JWT Key not available");
}

export const verifyAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Auth token not available" });
      throw new Error("Auth token not available");
    }
    const decodedToken = jwt.verify(token, jwtKey);
    // @ts-ignore
    req.userData = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Invalid or expired token provided",
      error: error,
    });
  }
};
