/******************************************************************************
ITE5315 – Project
I declare that this assignment is my own work in accordance with Humber Academic Policy.
No part of this assignment has been copied manually or electronically from any other source
(including web sites) or distributed to other students.
Name:Bahare Ghasemi Student ID:N01538197 Date:2024-04-18
********************************************************************************/
const database = require("./database");
const resolvers = {
  Query: {
    getRestaurantbyId: async (_, { id }) => {
      const restaurant = await database.getRestaurantById(id); 
      return restaurant;
    },
    getAllRestaurants: async (_, {page, perPage, borough}) => {
      const restaurants = await database.getAllRestaurants(page, perPage, borough);
      return restaurants;
    }
  }
};

module.exports = resolvers;
