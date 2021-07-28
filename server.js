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



mongoose.connect(`${process.env.App_DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.connect('mongodb://localhost:27017/recipes', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// schema
const RecipeSchema = new mongoose.Schema({
    email:String,
    label: String,
    image: String,
    ingredients:Array
          });


// const User = new mongoose.Schema({
//     email: String,
//     rec: RecipeSchema
// });

const myrecipeModel = mongoose.model('RecipeSchema', RecipeSchema);
// const userrecipeModel = mongoose.model('user', User);

//
server.get('/', HomeRoute);
server.get('/recipes', GetRecipes);
//http://localhost:3001/AddRecipe
server.post('/AddRecipe/:email',addRecipeHandler);
server.get('/GetFavData/:email',GetFavData);
server.put('/updateRecipe/:id',updateRecipeFun);
server.delete('/DeleteRecipe/:id',deleteRecipe)

function GetFavData(req,res){
    const UserEmail=req.params.email
    myrecipeModel.find({email:UserEmail},(error,FavResult)=>{
        res.send(FavResult)
    })

}
function addRecipeHandler (req,res){
// console.log('aaaaa',req.body);
let { label, image,ingredients } = req.body
let email=req.params.email
const NewPecipe=new myrecipeModel ({
    email:email,
    label:label,
    image:image,
    ingredients:ingredients

})
NewPecipe.save()

//   userrecipeModel.find({ email: Email }, (error, recipeData) => {
//     if (error) {
//         res.send(error, 'no favert')
//     }
//     else {
//         // console.log('ttttttt',recipeData[0].rec)
        
// // console.log(recipeData[0])


//         // recipeData[0].rec.push({
//         //     label:label,
//         //     image:image,
//         //     ingredients:ingredients
          
           

//         // })
//         console.log('after adding', recipeData[0])
//         // recipeData[0].save()
//         // res.send(recipeData[0].rec)

//     }
// })
}
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

function updateRecipeFun (req,res){

    console.log('aaaaaa',req.body);
    console.log('aaaaaa',req.params);

    let {updateLabel,updateImage,userEmail} = req.body;
    let index = Number(req.params.id);
    myrecipeModel.find({email:userEmail},(error,recipeData)=>{
        if(error)
        res.send('error in finding the data')
        else {
            
            recipeData.map((item,idx)=>{
                    if(idx==index){
                    item.label=updateLabel
                    item.image=updateImage
                    item.save()                       
                    }
                    
                })          

            // console.log(recipeData)
            // recipeData.splice(index,1,{
            //     label:updateLabel
            // })
            // console.log(recipeData)
            
            // recipeData.save();
            // res.send(recipeData)
            res.send(recipeData)
         }
    })

}
function deleteRecipe(req,res){
let email = req.query.userEmail;
let index=req.params.id
console.log(index);
console.log(email);
// let email=req.params.userEmail
myrecipeModel.deleteOne({_id:index},(error,data)=>{
myrecipeModel.find({email:email},(error,data)=>{      
        res.send(data)
    })
})
}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });