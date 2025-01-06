import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { pool } from "./db";

dotenv.config();
const jwtKey = process.env.JWT_KEY;

if (!jwtKey) {
  throw new Error("JWT Key not available");
}

interface UserData {
  id: number;
  username: string;
}

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Auth token not available" });
      throw new Error("Auth token not available");
    }
    const decodedToken = jwt.verify(token, jwtKey) as UserData;

    // @ts-ignore
    const [rows] = await pool.query(
      `SELECT user_id from users WHERE username = ?`,
      [decodedToken.username]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    // @ts-ignore
    req.userData = { id: rows[0].user_id, username: decodedToken.username };

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Invalid or expired token provided",
      error: error,
    });
  }
};
