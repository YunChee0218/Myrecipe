const express = require('express')
const router = express.Router()
const Recipe = require('../models/recipe')
const Category = require('../models/category')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//All Recipes Route
router.get('/', async (req, res) => {
    let query = Recipe.find()
    if(req.query.title && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    try{
        const recipes = await query.exec()
        res.render('recipes/index', { 
            recipes: recipes,
            searchOptions: req.query 
        })
    }catch{
        res.redirect('/')
    }
})

//New Recipe Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Recipe())
})

//Create Recipe Route
router.post('/', async (req, res) => {
    const recipe = new Recipe({
        title: req.body.title,
        category: req.body.category,
        createDate: new Date(req.body.createDate),
        ingredients: req.body.ingredients,
        description: req.body.description
    })
    if (req.body.image && req.body.image !== ''){
        saveImage(recipe, req.body.image)
    }

    try{
        const newRecipe = await recipe.save()
        res.redirect(`recipes/${newRecipe.id}`)
    }catch{
        renderNewPage(res, recipe, true)
    }
})

//Show Recipe Route
router.get('/:id', async (req, res) => {
    try{
        const recipe = await Recipe.findById(req.params.id).populate('category').exec()
        res.render('recipes/show', { recipe: recipe })
    }catch{
        res.redirect('/')
    }
})

//Edit Recipe Route
router.get('/:id/edit', async (req, res) => {
    try{
        const recipe = await Recipe.findById(req.params.id)
        renderEditPage(res, recipe)
    }catch{
        res.redirect('/')
    }
})

//Update Recipe Route
router.put('/:id', async (req, res) => {
    let recipe
    try{
        recipe = await Recipe.findById(req.params.id)
        recipe.title= req.body.title,
        recipe.category= req.body.category,
        recipe.createDate= new Date(req.body.createDate),
        recipe.ingredients= req.body.ingredients,
        recipe.description= req.body.description
        if (req.body.image && req.body.image !== ''){
            saveImage(recipe, req.body.image)
        }
        await recipe.save()
        res.redirect(`/recipes/${recipe.id}`)
    }catch{
        if(recipe){
            renderEditPage(res, recipe, true)
        }else{
            res.redirect('/')
        }
    }
})


//Delete recipe route
router.delete('/:id', async (req, res) => {
    let recipe
    try{
        recipe = await Recipe.findById(req.params.id)
        await recipe.remove()
        res.redirect('/recipes')
    }catch{
        if(recipe){
            res.render('recipes/show', {
                recipe: recipe,
                errorMessage: 'Could not remove recipe'
            })
        }else{
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, recipe, hasError = false) {
    renderFormPage(res, recipe, 'new', hasError)
}
  
async function renderEditPage(res, recipe, hasError = false) {
    renderFormPage(res, recipe, 'edit', hasError)
  }

async function renderFormPage(res, recipe, form, hasError = false){
    try {
      const categories = await Category.find({})
      const params = {
        categories: categories,
        recipe: recipe
      }
      if(hasError){
        if(form === 'edit'){
          params.errorMessage = 'Error Updating Recipe'
        }else{
          params.errorMessage = 'Error Creating Recipe'
        }
      }
      res.render(`recipes/${form}`, params)
    } catch {
      res.redirect('/recipes')
    }
}

function saveImage(recipe, imageEncoded){
    if(imageEncoded == null) return
    const image = JSON.parse(imageEncoded)
    if(image != null && imageMimeTypes.includes(image.type)){
        recipe.image = new Buffer.from(image.data, 'base64')
        recipe.imageType = image.type 
    }
}

module.exports = router
