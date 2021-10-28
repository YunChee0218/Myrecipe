const mongoose = require('mongoose')
const Recipe = require('./recipe')
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

categorySchema.pre('remove', function(next){
    Recipe.find({ category: this.id }, (err, recipes) => {
        if(err){
            next(err)
        }else if(recipes.length > 0){
            next(new Error('This category has recipes still'))
        }else{
            next()
        }
    })
})

module.exports = mongoose.model('Category', categorySchema)