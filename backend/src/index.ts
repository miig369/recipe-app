import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import * as RecipeAPI from "./recipe-api"
import { pool } from './db'

const app = express();
dotenv.config();
const PORT = process.env.PORT;

//middleware
app.use(express.json())
app.use(cors())

app.get("/api/recipes/search", async(req, res)=>{
    // GET http://localhost:8080/api/recipes/search?searchTerm=beef&page=2

    const searchTerm = req.query.searchTerm as string
    const page = parseInt(req.query.page as string)
    const results = await RecipeAPI.searchRecipes(searchTerm, page)
    res.json(results)
})


app.get('/users', async (req, res)=>{

    try{
        const result = await pool.query("SELECT * FROM users")
        res.json(result.rows)
    }catch(error){
        console.error(error)
    }
   
})


app.listen(PORT, ()=> {
    console.log(`listening at port: ${PORT}`)
})
