const mongoose = require('mongoose');

const connectDB = async () =>{
    try{

        const conn = await mongoose.connect(process.env.Mongodb_URI);
        console.log("Your database connected");
    }
    catch(err){
        console.log(`MongoDB Error : ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;