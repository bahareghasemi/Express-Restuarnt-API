const { gql } = require('apollo-server');

const typeDefs = gql`
"A Restaurant Object"
  type Address {
    building: String
    coord: [Float]
    street: String
    zipcode: String
    borough: String
  }

  type Grade {
    date: String
    grade: String
    score: Float
  }

  type Restaurant {
    _id: ID!
    name: String
    address: Address
    cuisine: String
    grades: [Grade!]
    restaurant_id: String
  }

  input RestaurantInput {
    name: String!
    address: AddressInput
    cuisine: String
    grades: [GradeInput]
    restaurant_id: String
  }

  input AddressInput {
    building: String
    coord: [Float]
    street: String
    zipcode: String
    borough: String
  }

  input GradeInput {
    date: String
    grade: String
    score: Float
  }

  type Query {
    getRestaurantbyId(id: ID!): Restaurant
    getAllRestaurants(page: Int!, perPage: Int!, borough: String): [Restaurant]
  }

`;

module.exports = typeDefs;
