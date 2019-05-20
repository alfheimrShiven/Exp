// Dependencies
const mongoose = require('mongoose')

// Schema
const userSchema = mongoose.Schema({
    fname: {
        type: String,
    },
    lname: {
        type: String
    },
    dob: {
        type: Date
    },
    sex: {
        type: String
    },
    phone: {
        type: Number,
        unique: true
    },
    mail: {
        type: String,
        unique: true
    },
    location: {
        addressLine: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        pin: {
            type: Number,
        },
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

const user = module.exports = mongoose.model('user', userSchema)
