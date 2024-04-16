const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLSchema } = require('graphql');

const RestaurantType = new GraphQLObjectType({
  name: 'Restaurant',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    cuisine: { type: GraphQLString },
    // Define other fields as needed
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    restaurant: {
      type: RestaurantType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // Logic to fetch a single restaurant by ID from the database
      }
    },
    restaurants: {
      type: new GraphQLList(RestaurantType),
      resolve(parent, args) {
        // Logic to fetch all restaurants from the database
      }
    }
    // Define other queries as needed
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
