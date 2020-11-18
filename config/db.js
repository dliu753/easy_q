const mongoose = require('mongoose');

const connDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err);
        process.exit;
    }
};

module.exports = connDB;