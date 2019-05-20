// Dependencies
const express = require('express')
const postal = require('postcode-validator')
const phone = require('phone')

// Files
const User = require("../models/users")

// Initialize router
const router = express.Router()

// GET @ Dashboard
router.get('/dashboard', (req, res) => {
    // if (req.session.user) {
        res.render('dashboard', {
            status: {
                success: true,
                code: 200,
                title: req.session.user.fname + ' ' + req.session.user.lname
            }
        })
    // }
    // else {
    //     res.redirect('/login')
    //     To the OTP API by Shiven
    // }
})

// GET @ Register
router.get('/profile', (req, res) => {
    res.render('profile', {
        status: {
            success: true,
            code: 200,
            title: 'Profile Details'
        }
    })
});

// POST @ exists
router.post('/exists', (req, res) => {
    User.findOne({
        phone: req.body.phone
    }, (err, user) => {
        if (err) {
            throw err
        }
        else if (!user) {
            res.redirect('/user/profile')
        }
        else {
            req.session.user = user
            res.redirect('/user/dashboard')
        }
    })
})

// POST @ Register
router.post('/profile', (req, res) => {
    req.checkBody('fname', 'First Name is required').notEmpty()
    req.checkBody('lname', 'Last Name is required').notEmpty()
    req.checkBody('dob', 'Date is required').notEmpty()
    req.checkBody('phone', 'Phone Number is required').notEmpty()
    req.checkBody('mail', 'Email is required').notEmpty()
    req.checkBody('sex', 'Sex is required').notEmpty()
    req.checkBody('address', 'Address is required').notEmpty()
    req.checkBody('city', 'City is required').notEmpty()
    req.checkBody('state', 'State is required').notEmpty()
    req.checkBody('pin', 'PIN code is required').notEmpty()
    req.checkBody('mail', 'Invalid email address').isEmail()
    const errs = req.validationErrors()
    const msg = []
    if (!postal.validate(req.body.pin, 'IN')) {
        msg.push("Invalid PIN code")
    }
    if (phone(req.body.phone).length == 0) {
        msg.push("Invalid Phone number")
    }
    if (errs) {
        errs.forEach(err => {
            msg.push(err.msg)
        })
    }
    if (msg.length > 0) {
        res.send({
            status: {
                success: false,
                code: 400,
                msg
            }
        })
    }
    else {
        const newUser = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            dob: req.body.dob,
            sex: req.body.sex,
            phone: req.body.phone,
            mail: req.body.mail,
            location: {
                addressLine: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pin: req.body.pin,
            },
        })
        newUser.save((err, newUser) => {
            if (err) {
                if (err.code == 11000) {
                    res.send({
                        status: {
                            success: false,
                            code: 409,
                            msg: [
                                'User already exists'
                            ]
                        }
                    })
                }
                else {
                    throw err
                }
            }
            else {
                req.session.user = newUser;
                res.redirect('/user/dashboard')
            }
        })
    }
})

module.exports = router;
