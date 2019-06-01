// Dependencies
const mongoose = require('mongoose')

// Schema
const rtoSchema = mongoose.Schema({
    registeredCityName: {
        type: String,
    },
    registeredStateName: {
        type: String
    },
    rtoCode: {
        type: String
    }
})

const rto = module.exports = mongoose.model('rto', rtoSchema)
