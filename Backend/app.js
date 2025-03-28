// const express = require('express')
import express from "express"
const app = express()
// const cors = require("cors")
import cors from "cors"
// const authRoutes = require('./routes/index.js')
import authRoutes from "./routes/index.js"

const PORT=process.env.PORT||4000;
// const connectedDB = require("./Db/connect.db.js")

// const client = require("../Backend/Db/index.js")
import client from "../Backend/Db/index.js"


// connectedDB()

// app.use(cors)
app.use(express.json())//express jason is a middleware parse inconig ijson requiest and make available for req.body
app.use(cors())



app.get('/',(req,res)=>{
     res.send("Api is runing");
})

app.use('/api/v1',authRoutes)

app.listen(PORT,()=>{
    console.log("server is runng ar "+ PORT)
})