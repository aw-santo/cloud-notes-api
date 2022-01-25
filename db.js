const mongoose = require('mongoose');

require('dotenv').config(); // for environment variables in node

const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
    mongoose.connect(mongoURI, () => {
        console.info("connected to mongo successfully✅");
    })
}

module.exports = connectToMongo;