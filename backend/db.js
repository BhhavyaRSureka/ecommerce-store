const mongoose = require("mongoose");
require("dotenv/config");

const connectToDatabase = () => {
  mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected to db")
  );
};

module.exports = connectToDatabase;