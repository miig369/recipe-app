import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();
const jwtKey = process.env.JWT_KEY;

if(!jwtKey){
    throw new Error("JWT Key not available");
}

export const verifyAuth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, jwtKey)
        req.userData = decodedToken;
        next();
    }catch(error){
        console.log(error)
        res.status(401).json({
            "message": "Invalid or expired token provided",
            "error": error
        })
    }
}