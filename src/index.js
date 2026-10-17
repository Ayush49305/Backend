import dotenv from "dotenv"
import connectionDB from "./db/index.js"

dotenv.config({
    path:'./.env'
})
connectionDB()

.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("MONGODB Connection error",error);
})


// import mongoose from "mongoose";
// import {DB_NAME} from "./constants";

// import express from "express";

// const app=express()

// (async()=>{
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error",(error)=>{
//         console.log("ERROR:",error);
//         throw error
//        })

//        app.listen(process.env.PORT,()=>{
//         console.log(`App is running on port ${process.env.PORT}`)
//        })

//     }catch(error){
//         console.error("ERROR: ",error)
//         throw err
//     }

// })