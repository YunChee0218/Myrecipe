const mongoose = require('mongoose')


const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    ingredients:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    createDate:{
        type: Date,
        required: true
    },
    // createAt:{
    //     type: Date,
    //     required: true,
    //     default: Date.now
    // },
    image:{
        type: Buffer,
        required: true
    },
    imageType:{
        type: String,
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
})

recipeSchema.virtual('imagePath').get(function(){
    if(this.image != null && this.imageType != null){
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
})

module.exports = mongoose.model('Recipe', recipeSchema)

