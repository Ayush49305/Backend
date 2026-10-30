// import mongoose from 'mongoose';
// import {DB_NAME} from '../constants.js';

// const connectionDB=async ()=>{
//     try{
//         const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log('\nMongoDB connectedd !! DB HOST"${connectionInstance.connecction.host}');
//     }
//     catch(error){
//         console.log("MONGODB connection error",error);
//         process.exit(1)
//     }
// }
// export default connectionDB

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;