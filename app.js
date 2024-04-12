/******************************************************************************
ITE5315 – Project
I declare that this assignment is my own work in accordance with Humber Academic Policy.
No part of this assignment has been copied manually or electronically from any other source
(including web sites) or distributed to other students.
Name:Bahare Ghasemi Student ID:N01538197 Date:2024-04-11
******************************************************************************/
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const appConfig = require("./package.json");

const path = require('node:path');
const app = express();
const database = require("./config/database");
const bodyParser = require("body-parser"); 

const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: "application/vnd.api+json" })); 
const { body, param, query, validationResult } = require('express-validator'); 
const { engine } = require('express-handlebars');
app.use(express.static(path.join(__dirname, 'public')));
// Initialize the database before starting the server
database.initialize().then(() => {
  
    //Add a new retaurant in database
    app.post('/api/restaurants', async (req, res) => {
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
    app.put('/api/restaurants/:id',async(req,res)=>{
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
    app.delete("/api/restaurants/:id", async (req, res) => {
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


      
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error('Failed to initialize the database:', error);
    process.exit(1);
});

  