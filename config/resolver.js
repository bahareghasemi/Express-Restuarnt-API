const Restaurant = require('../models/restaurant_graphql');
const Restaurantdata=[{
  "_id": {
    "$oid": "5eb3d668b31de5d588f4292a"
  },
  "address": {
    "building": "2780",
    "coord": [
      -73.98241999999999,
      40.579505
    ],
    "street": "Stillwell Avenue",
    "zipcode": "11224"
  },
  "borough": "Brooklyn",
  "cuisine": "American",
  "grades": [
    {
      "date": {
        "$date": "2014-06-10T00:00:00.000Z"
      },
      "grade": "A",
      "score": 5
    },
    {
      "date": {
        "$date": "2013-06-05T00:00:00.000Z"
      },
      "grade": "A",
      "score": 7
    },
    {
      "date": {
        "$date": "2012-04-13T00:00:00.000Z"
      },
      "grade": "A",
      "score": 12
    },
    {
      "date": {
        "$date": "2011-10-12T00:00:00.000Z"
      },
      "grade": "A",
      "score": 12
    }
  ],
  "name": "Riviera Caterer",
  "restaurant_id": "40356018"
}]
const resolvers = {
  restaurant: async ({ id }) => {
    console.log(`Fetching restaurant with ID: ${id}`);
    const restaurant = await Restaurant.findById(id);
    console.log('Restaurant found:', restaurant);
    return restaurant;
  },
  restaurants: async () => {
    console.log('Fetching all restaurants');
    const restaurants = await Restaurantdata[0];
    console.log('Restaurants found:', restaurants);
    return restaurants;
  },
};

module.exports = resolvers;
