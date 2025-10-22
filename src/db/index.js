import mongoose from "mongoose";

import { DB_NAME } from "../constant.js";

const connectDB = async ()=>{
    try {
        const connnectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB conneted !! DB HOST ${connnectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB connnection error! ",error)
        process.exit(1)
    }
}

export default connectDB