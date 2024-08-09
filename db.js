const mongoose = require("mongoose");

const mongoURI =
  "mongodb://localhost:27017/iNote?directConnection=true&readPreference=primary";

const connectToMongo = () => {
  mongoose.connect(mongoURI);
};

module.exports = connectToMongo;
