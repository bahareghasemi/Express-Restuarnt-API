const database = require("./database");
const resolvers = {
  Query: {
    restaurant: async (_, { id }) => {
      console.log(`Fetching restaurant with ID: ${id}`);
      const restaurant = await database.getRestaurantById(id); 
      return restaurant;
    },
    restaurants: async (_, {page, perPage, borough}) => {
      console.log('Fetching all restaurants');
      const restaurants = await database.getAllRestaurants(page, perPage, borough);
      return restaurants;
    }
  }
};

module.exports = resolvers;
