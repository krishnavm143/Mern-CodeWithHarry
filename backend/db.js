const mongoose = require("mongoose");
const mongoUri = `mongodb://localhost:27017/inotebook`;

const connectToMongo = () => {
  mongoose.connect(mongoUri, () => {
    console.log("Mongodb connected succesfully");
  });
};

module.exports = connectToMongo;
