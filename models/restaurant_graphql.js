/******************************************************************************
ITE5315 – Project
I declare that this assignment is my own work in accordance with Humber Academic Policy.
No part of this assignment has been copied manually or electronically from any other source
(including web sites) or distributed to other students.
Name:Bahare Ghasemi Student ID:N01538197 Date:2024-04-18
********************************************************************************/
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