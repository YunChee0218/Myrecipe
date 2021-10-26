const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

module.exports = router