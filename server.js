'use strict';

require("dotenv").config();
const express = require('express');
const cors = require('cors')
const server = express();
const axios = require('axios');
// const mongoose = require("mongoose");

const PORT = process.env.PORT;
server.use(cors());
server.use(express.json())



// mongoose.connect("mongodb://localhost:27017/recipes", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

server.get('/', HomeRoute);
server.get('/recipes', GetRecipes);


function HomeRoute (req,res) {
    res.send('Home Route Working')
}

// https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=eac936f6&app_key=7f9337deefbf0b8dbe0f0594c9990a6d
function GetRecipes (req, res) {

    let recipesArr = []

    let searchQuery = req.query.searchQuery
    let mealType = req.query.mealType
    let cuisineType = req.query.cuisineType

    let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}&mealType=${mealType}&cuisineType=${cuisineType}`

    axios.get(url).then(response => {
        recipesArr = response.data.hits.map(item => {
            return new Recipe(item);
        })
        res.send(recipesArr)
        
    })
}

class Recipe {
    constructor(item){
        this.label = item.recipe.label,
        this.image = item.recipe.image,
        this.ingredients = item.recipe.ingredients,
        this.mealType = item.recipe.mealType,
        this.cuisineType = item.recipe.cuisineType
    }
}









server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });