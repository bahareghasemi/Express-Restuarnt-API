/******************************************************************************
ITE5315 – Project
I declare that this assignment is my own work in accordance with Humber Academic Policy.
No part of this assignment has been copied manually or electronically from any other source
(including web sites) or distributed to other students.
Name:Bahare Ghasemi Student ID:N01538197 Date:2024-04-18
********************************************************************************/
require("dotenv").config();
const saltRandom = 5;
const express = require("express");
const mongoose = require("mongoose");
const appConfig = require("./package.json");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session'); 
const cookieParser = require('cookie-parser'); 
const { ApolloServer, gql } = require('apollo-server');

const path = require('node:path');
const app = express();
const database = require("./config/database");
const bodyParser = require("body-parser"); 
const authList = require('./config/authList.json');

const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: "application/vnd.api+json" })); 
const { body, param, query, validationResult } = require('express-validator'); 
const { engine } = require('express-handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
// app.use(session({
//   session: process.env.SECRET_KEY,
//   resave: false,
//   saveUninitialized: true
// }));

// Initialize the database before starting the server
database.initialize().then(() => {
    //Token Generating by calling below route
    app.get('/api/token',  async(req, res) => {
      const auth = req.headers.authorization;
      if(!auth){
        res.status(401).send('Authorization data not found');
        return;
      }
      [type, cred] = auth.split(' ');
      if(type!="Basic"){
        res.status(401).send('Only supported authentication mode is Basic');
        return;      
      }
          
      const decodedCred = Buffer.from(cred, 'base64').toString('utf-8');
      [user, pass]=decodedCred.split(':');
      const queriedUser = authList.find(a=>a.user===user);
      
      let success = false;
      if(queriedUser){
        success = await bcrypt.compare(pass, queriedUser.passHash);
      }
      
      if(!success){      
        res.status(401).send('Authentication failed, invalid userName/password');
      }
      else
      {
        const payload = { username: user, role: 'user', authorized: success};
        const token = jwt.sign(payload, process.env.SECRET_KEY);
        res.cookie('token', token);
        res.status(200).send({token: token});
        
      }
      
  });
  
  // Middleware for JWT verification
  const verifyToken = (req, res, next) => {
    //There are two ways to send token, by cookie or in header authorization
    let authHeader=req.cookies;
    let token;
    if (authHeader)
      token=authHeader.token;
    //read authorization in header
    else if (!authHeader)
    {
      authHeader = req.headers.authorization;
      token = authHeader.split(' ')[1];
      if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
      }
    }
    
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  };

    //Add a new retaurant in database
    app.post('/api/restaurants', verifyToken, async (req, res) => {
        try {
          if (!req.query || Object.keys(req.query).length === 0)  {
            return res.status(400).json({ message: 'It is empty or missing restuarant!' });
          }
          const rest = await database.addNewRestaurant(req.query);
          res.status(201).json({message:'Restaurant added!',rest});
        } catch (error) {
          console.error('Adding new restaurant failed! Error:', error.message);
          res.status(500).send('Internal Server Error');
        }
    }); 

    //Template Engind and Form
    app.engine('.hbs', engine({extname: '.hbs',}));
    app.set('view engine', '.hbs');
    
    //Route for rendering a search form
    app.get('/api/restaurants/search', (req,res) => {
      res.render('restaurantForm.hbs');
    })
    //Result restaurant search
    app.post('/api/restaurants/search', 
    [
      body('page').isNumeric().withMessage('Page must be a number'),
      body('perPage').isNumeric().withMessage('PerPage must be a number'),
      body('borough').optional().isString().withMessage('Borough must be a string')
    ], async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).render('error',{message:'Validation error', errors: errors.array()});
        }
        try {
          const { page, perPage } = req.body;
          const borough = req.body.borough;
          const rest = await database.getAllRestaurants(page, perPage, borough);
          if (rest.length === 0) {
            return res.status(404).render('error', { message: 'No restaurants found!' });
          }
          res.status(200).render('restaurantDisplay',{page, perPage, borough,restaurants: rest});
        } catch (reason) {
          res.status(500).render('error',{message:'Internal error',reason:reason.message});
        }
    })


    //Geting all restaurant by accepting page,perPage,borough
    //Retrive inputs from query
    const Inputs = [
      query('page').isNumeric().toInt(),
      query('perPage').isNumeric().toInt(),
      query('borough').optional().isString()
    ];
    
    // Middleware to handle Inputs validation errors
    const ValidationErrors = (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    };
    
    //Get
    app.get('/api/restaurants', Inputs, ValidationErrors, async (req, res) => {
    //calling database function to get all restaurants
    try {
        const { page, perPage, borough } = req.query;
        const rest = await database.getAllRestaurants(page, perPage, borough);
        console.log("Restaurant data retrieved.");
        res.status(200).json({ message: 'Restaurants successfully retrieved.', data: rest });
    } catch (error) {
        console.error('Error getting all restaurants:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
   });

    //Geting all restaurants by Id
    app.get('/api/restaurants/:id',
      [param('id').isMongoId().withMessage("Id is not valid!")]
      , async (req, res) => {
        const result = validationResult(req);
        if(!result.isEmpty()){
          return res.status(400).json({ message:'Id is not valid! ',errors: result.array() });
        }
        //calling database function to get all restaurants
        try {
          const Id = req.params.id;
          const rest = await database.getRestaurantById(Id);
          if(!rest){
              return res.status(404).json({ error: 'Restaurant not found by Id!' });
          }
          res.status(200).json({ message: 'Restaurant successfully retrieved. ', data: rest});
        } catch (error) {
            console.error('Error getting restaurant by Id: ', error.message);
            res.status(500).json(error);
        }
    });

    //Updating a restaurant by Id
    app.put('/api/restaurants/:id', verifyToken,async(req,res)=>{
      try {
          const rest = await database.updateRestaurantById(req.params.id, req.query);
          if (!rest) {
              return res.status(404).json({ error: 'Restaurant not found by Id!' });
          }
          console.log("Restaurant successfully updated. borough:" + rest.borough + " | restaurant_id:" + rest.restaurant_id);
          res.status(200).json({message:'Restaurant successfully updated.', data: rest});
      } catch (error) {
          if (error instanceof mongoose.Error.CastError) {
              return res.status(400).json({ error: 'Id must be valid ObjectId!' });
          }
          console.error('Updating the restaurant by Id failed! ', error.message);
          res.status(500).json({error:'Internal Server Error.', message:'Updating the restaurant by Id failed!'});
      }
    });

    //Deletion of an existing restaurant based on _id as route parameter
    app.delete("/api/restaurants/:id", verifyToken, async (req, res) => {
      try {
          const Id = req.params.id;
          const rest = await database.deleteRestaurantById(Id);
          if(rest){
              console.log("Restaurant successfully deleted.");
              return res.status(200).json({ message: 'Restaurant successfully deleted.' });
          }
          else{
              return res.status(404).json({ error: 'Restaurant not found by id!' });
          }
      } catch (error) {
          if (error instanceof mongoose.Error.CastError) {
              return res.status(400).json({ error: 'Id must be a valid ObjectId!' });
          }
          res.status(500).json({error:'Internal Server Error!'});
      }
    });

  // GraphQL endpoint
  const typeDefs = require("./models/restaurant_graphql"); 
  const resolvers = require('./config/resolver');
  const server = new ApolloServer({typeDefs,resolvers});
  server.listen(4000).then(({ url }) => {
    console.log(`Graphql Server ready at ${url}`);
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((error) => {
  console.error('Failed to start Apollo Server:', error);
  process.exit(1);
});

module.exports = app;
  