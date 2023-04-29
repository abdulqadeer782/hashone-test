const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongodb database")
    } catch (error) {
        console.log(`Error in mongodb ${error}`)
    }
}

module.exports = connectDB;