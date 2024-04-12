/******************************************************************************
ITE5315 – Project
I declare that this assignment is my own work in accordance with Humber Academic Policy.
No part of this assignment has been copied manually or electronically from any other source
(including web sites) or distributed to other students.
Name:Bahare Ghasemi Student ID:N01538197 Date:2024-04-11
******************************************************************************/
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