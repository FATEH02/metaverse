const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/metaverse";

async function connectedDB()
{
  try{
   await mongoose.connect(MONGO_URL);
   console.log("db is connected");
  }catch(err)
  {
      console.log("mongodb is not connected:",err)
  }
}

module.exports = connectedDB