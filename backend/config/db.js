const mongoose = require('mongoose');

const connectDB = async () =>{
    try{

        const uri = process.env.Mongodb_URI || process.env.MONGO_URI;
        const conn = await mongoose.connect(uri);
        console.log("Your database connected");
        return conn;
    }
    catch(err){
        console.log(`MongoDB Error : ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;