const mongoose = require("mongoose");
const Schema = mongoose.Schema;

RestuarantSchema = new Schema({
  address: {
    building: String,
    coord: [Number],
    street: String,
    zipcode: String,
    borough: String,
  },
  cuisine: String,
  grades: [
    {
      date: Date,
      grade: String,
      score: Number
    }
  ],
  name: String,
  restaurant_id: String  });

module.exports = mongoose.model("restaurants", RestuarantSchema);
