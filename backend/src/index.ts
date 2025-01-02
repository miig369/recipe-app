import express from 'express';
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();
const PORT = process.env.PORT;


//middleware
app.use(express.json())
app.use(cors())

app.get("/", (req, res)=>{
    res.json({message: "hello world"})
})

app.listen(PORT, ()=> {
    console.log(`listening at port: ${PORT}`)
})
