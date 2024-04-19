/******************************************************************************
ITE5315 – Project
I declare that this assignment is my own work in accordance with Humber Academic Policy.
No part of this assignment has been copied manually or electronically from any other source
(including web sites) or distributed to other students.
Name:Bahare Ghasemi Student ID:N01538197 Date:2024-04-18
********************************************************************************/
 const url = process.env.DB_CONNECTION_STRING;
// const url = "mongodb+srv://bahareghasemiphh:Sherwin2023@cluster0.wvy0j1o.mongodb.net/5315-project";
const mongoose = require('mongoose');
const Restaurant = require("../models/restaurant");

const initialize = async () => {
    try {
        await mongoose.connect(url);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const addNewRestaurant = async(data)=>{
    try{
        const rest = new Restaurant(data);
        await rest.save();
        return rest;
    } catch (error) {
        console.error('Creating new restaurant failed! Error :', error.message);
        throw error;
    }
};

const getAllRestaurants = async (page, perPage, borough)=>{
    try{
        const bor = borough ? {borough}:{};
        const rest = await Restaurant.find(bor).skip((page-1)*perPage).limit(perPage).lean();
        return rest;
    } catch (error){
        console.error('Getting all restuarant information failed! Error: ',error.message);
        throw error;
    }
};

const getRestaurantById = async (Id)=>{
    try{
        const rest = await Restaurant.findById(Id);
        return rest;
    } catch (error){
        console.error('Getting restaurant by Id failed! Error: ',error.message);
        throw error;
    }
};

const updateRestaurantById  = async (Id,data)=>{
    try{
        const rest = await Restaurant.findByIdAndUpdate(Id,data,{new:true});
        return rest;
    } catch (error){
        console.error('Updating the restaurant by Id failed! Error: ',error.message);
        throw error;
    }
};

const deleteRestaurantById  = async (Id)=>{
    try{
        const rest = await Restaurant.findOneAndDelete({_id:Id,});
        return rest;
    } catch (error){
        console.error('Deleting the restaurant by Id failed! Error ',error.message);
        throw error;
    }
};

module.exports = {  initialize,
                    addNewRestaurant, 
                    getAllRestaurants, 
                    getRestaurantById,
                    updateRestaurantById,
                    deleteRestaurantById
                 };
