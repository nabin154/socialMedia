const mongoose = require("mongoose");
const colors= require("colors");

const dbConnect = async () =>{
    try{
       mongoose.connect(process.env.MONGODB_URL);
       console.log("MongoDB connected succesfully".blue.bold);
       return

    }
    catch(err){
        console.error(err);
    }
}
 module.exports = {dbConnect};