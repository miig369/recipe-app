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

declare global {
  namespace Express {
    interface Request {
      user?: UserData;
    }
  }
}

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (req.headers.cookie) {
    try {
      token = req.headers.cookie.split("=")[2];

      const decodedToken = jwt.verify(token, jwtKey) as UserData;

      const row = await pool.query(
        `SELECT user_id from users WHERE username = $1`,
        [decodedToken.username]
      );

      if (row.rows.length === 0) {
        throw new Error("User not found");
      }

      req.user = {
        id: row.rows[0].user_id,
        username: decodedToken.username,
      };

      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        message: "Invalid or expired token provided",
        error: error,
      });
    }
  }
};
