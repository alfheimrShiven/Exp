// Dependencies
const express = require('express')
const postal = require('postcode-validator')
const phone = require('phone');

// Files
const User = require("../models/users")

// Initialize router
const router = express.Router()

// GET @ Dashboard
router.get('/dashboard', (req, res) => {
    // if (req.session.user) {
        res.render('my_policy_db', {
            status: {
                success: true,
                code: 200,
                title: 'Dashboard'
            }
        })
    // }
    // else {
    //     res.redirect('/login')
    //     To the OTP API by Shiven
    // }
})

// GET @ Register
router.get('/profilepg', (req, res) => {
    res.render('my_profile_db', {
        status: {
            success: true,
            code: 200,
            title: 'Profile Details'
        }
    })
});

// POST @ exists
router.post('/exists', (req, res) => {
    console.log("Inside user exists API with phone:"+ String(req.body.phone));
    User.findOne({
        phone: req.body.phone
    }).then(doc => {
        if(!doc) 
        res.redirect('profilepg').send("New User");
        else{
        res.redirect('dashboard').send("Old user");
        console.log("Found a user:"+ doc);
        }
    }).catch(err=> console.error(err));
});

// POST @ Register
router.post('/profilesave', (req, res) => {
    // req.checkBody('fname', 'First Name is required').notEmpty()
    // req.checkBody('lname', 'Last Name is required').notEmpty()
    // req.checkBody('dob', 'Date is required').notEmpty()
    // req.checkBody('phone', 'Phone Number is required').notEmpty()
    // req.checkBody('mail', 'Email is required').notEmpty()
    // req.checkBody('sex', 'Sex is required').notEmpty()
    // req.checkBody('address', 'Address is required').notEmpty()
    // req.checkBody('city', 'City is required').notEmpty()
    // req.checkBody('state', 'State is required').notEmpty()
    // req.checkBody('pin', 'PIN code is required').notEmpty()
    // req.checkBody('mail', 'Invalid email address').isEmail()
    // const errs = req.validationErrors()
    // const msg = []
    // if (!postal.validate(req.body.pin, 'IN')) {
    //     msg.push("Invalid PIN code")
    // }
    // if (phone(req.body.phone).length == 0) {
    //     msg.push("Invalid Phone number")
    // }
    // if (errs) {
    //     errs.forEach(err => {
    //         msg.push(err.msg)
    //     })
    // }
    // if (msg.length > 0) {
    //     res.send({
    //         status: {
    //             success: false,
    //             code: 400,
    //             msg
    //         }
    //     })
    // }
    // else {
        console.log("User phone:"+ (req.body.phone));
        let newUser = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            dob: req.body.dob,
            sex: req.body.sex,
            phone: req.body.phone,
            mail: req.body.mail,
            location: {
                addressLine: req.body.address,
                city: req.body.city,
                pin: req.body.pin,
            },
        });

        newUser.save((err, newUser) => {
            console.log("Inside save callback");
            if (err) {
                // if (err.code == ) {
                //     console.log("Duplicate key error while saving");
                //     res.send({
                //         status: {
                //             success: false,
                //             code: 409,
                //             msg: [
                //                 'User already exists'
                //             ]
                //         }
                //     });
                // }
                // else {
                    console.log("Error while saving:"+ err);
                    res.send({
                        status: {
                            success: false,
                            code: 409,
                            msg: [
                                'User already exists'
                            ]
                        }
                    });
                // }
            }
            else {
                // req.session.user = newUser;
                console.log("Redirecting to dashbd");
                res.render('my_policy_db');
            }
        });
    });

module.exports = router;
