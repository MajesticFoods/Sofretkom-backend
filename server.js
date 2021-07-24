'use strict';

require("dotenv").config();
const express = require('express');
const cors = require('cors')
const server = express();
const axios = require('axios');
const mongoose = require("mongoose");

const PORT = process.env.PORT;
server.use(cors());
server.use(express.json())



mongoose.connect("mongodb://localhost:27017/recipe", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// schema
const RecipeSchema = new mongoose.Schema({
    label: String,
    ingredients: Array,
    image: String,
   

});


const User = new mongoose.Schema({
    email: String,
    recipes: [RecipeSchema]
});

const myrecipeModel = mongoose.model('RecipeSchema', RecipeSchema);
const userrecipeModel = mongoose.model('user', User);








//
server.get('/', HomeRoute);
server.get('/recipes', GetRecipes);
//http://localhost:3001/AddRecipe
server.post('/AddRecipe',addRecipeHandler);

function addRecipeHandler (req,res){
console.log('aaaaa',req.body);
let {
    Email,
     label,
     image,
    ingredients,
    
    
  } = req.body

  userrecipeModel.find({ email: Email }, (error, recipeData) => {
    if (error) {
        res.send(error, 'no favert')
    }
    else {
        console.log('ttttttt',recipeData[0].recipes)
        recipeData[0].recipes.push({
            label,
            image,
            ingredients,
            
           

        })
        console.log('after adding', recipeData[0])
        recipeData[0].save()
        res.send(recipeData[0].recipes)

    }
})
}






function HomeRoute (req,res) {
    res.send('Home Route Working')
}

// https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=eac936f6&app_key=7f9337deefbf0b8dbe0f0594c9990a6d
function GetRecipes (req, res) {

    let recipesArr = []

    let searchQuery = req.query.searchQuery

    let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`

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
        this.ingredients = item.recipe.ingredients
    }
}









server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });