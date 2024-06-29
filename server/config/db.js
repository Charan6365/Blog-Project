const mongoose = require("mongoose");
const connectDB = async() =>{
    try{
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB);
        console.log("Successfully databse is connected");
    }
    catch(error){
   console.log(error);
    }
}



module.exports = connectDB;