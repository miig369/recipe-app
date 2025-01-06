import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as RecipeAPI from "./recipe-api";
import { pool } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as auth from "./auth";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
const PORT = process.env.PORT;
const jwtKey = process.env.JWT_KEY;

if (!jwtKey) {
  throw new Error("JWT_KEY is not defined in environment variables!");
}

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"], 
};

//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/api/recipes/search", async (req, res) => {
  // GET http://localhost:8080/api/recipes/search?searchTerm=beef&page=2
  const searchTerm = req.query.searchTerm as string;
  const page = parseInt(req.query.page as string);
  const results = await RecipeAPI.searchRecipes(searchTerm, page);
  res.status(200).json(results);
});

app.get("/api/recipes/:recipeId/summary", async (req, res) => {
  const { recipeId } = req.params;
  const result = await RecipeAPI.getRecipeById(recipeId);
  res.status(200).json(result);
});

//Favourites
app.post("/api/recipes/favourites", auth.verifyAuth, async (req, res) => {
  //@ts-ignore
  const { recipeId } = req.body;
  //@ts-ignore
  const userId = req.userData?.id;

  //@ts-ignore
  if (!recipeId) {
    res.status(400).json({ message: "Invalid recipe id" });
  }

  try {
    await pool.query(
      `INSERT INTO favourites (recipe_id, user_id) VALUES ($1, $2)`,
      [recipeId, userId]
    );

    res.status(201).json({
      recipeId,
      userId,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/recipes/favourites", auth.verifyAuth, async (req, res) => {
  console.log("req object", req);
  //@ts-ignore
  const userId = req.userData.id;

  console.log("Querying with user_id:", userId);
  try {
    const recipes = await pool.query(
      `SELECT recipe_id FROM favourites WHERE user_id = $1`,
      [userId]
    );

    const recipeIds = recipes.rows.map((recipe) => recipe.recipe_id.toString());

    const result = await RecipeAPI.getFavouriteRecipeById(recipeIds);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/recipes/favourites/", auth.verifyAuth, async (req, res) => {
  const { recipeId } = req.body;
  //@ts-ignore
  const userId = req.userData.id;

  console.log("recipe-id", recipeId);

  try {
    await pool.query(
      `DELETE FROM favourites WHERE recipe_id  = $1 AND user_id = $2`,
      [recipeId, userId]
    );

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});

// Auth
app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (!users.rows.length) {
      res.status(404).json({ detail: "User does not exist!" });
    }

    const success = await bcrypt.compare(password, users.rows[0].password);
    const token = jwt.sign({ username }, jwtKey, {
      expiresIn: "1hr",
    });

    if (success) {
      res.cookie("AuthToken", token, { httpOnly: true });
      res.status(200).json({ username: users.rows[0].username, token });
    } else {
      res.status(400).json({ detail: "Login failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: "Server error" });
  }
});

app.post("/api/users/register", async (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    await pool.query(
      `INSERT INTO users (username, password) VALUES ($1, $2);`,
      [username, hashedPassword]
    );

    const token = jwt.sign({ username }, jwtKey, { expiresIn: "1hr" });

    res.status(201).json({ username, token });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: "User registration failed" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`listening at port: ${PORT}`);
});
