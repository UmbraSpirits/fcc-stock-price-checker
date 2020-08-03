const mongoose = require("mongoose");

//Set up the database
const Schema = mongoose.Schema;

const stockDatabase = new Schema({
  symbol: {
    type: String,
    required: true,
  },
  like: {
    type: Boolean,
    default: false,
  },
  ip: {
    type: String,
  },
});

const stockData = mongoose.model("stockData", stockDatabase);
exports.stockData = stockData;
