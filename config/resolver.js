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
