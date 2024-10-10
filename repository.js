const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://mehmet34:mehmet175e@atlascluster.j3z8vqq.mongodb.net/mydatabase?retryWrites=true&w=majority");
        console.log(`Mongo db connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;
