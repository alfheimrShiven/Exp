// Dependencies
const express = require('express')
const postal = require('postcode-validator')
const phone = require('phone')

// Files
const User = require("../models/users")

// Initialize router
const router = express.Router()

// GET @ Edit Profile
router.get('/edit/:id', (req, res) => {
    if (req.params.id === req.session.user) {
        User.findById({ _id: req.params.id }, (err, user) => {
            if (err) {
                throw err
            }
            else {
                res.status(200).json({
                    status: {
                        success: true,
                        code: 200,
                        msg: [
                            'Edit Profile'
                        ]
                    },
                    data: {
                        user
                    }
                })
            }
        })
    }
    else {
        res.status(401).json({
            status: {
                success: true,
                code: 401,
                msg: [
                    'Login to edit your details'
                ]
            }
        })
    }
})

// GET @ Dashboard
router.get('/dashboard/:id', (req, res) => {
    if (req.params.id === req.session.user) {
        User.findById({ _id: req.params.id }, (err, user) => {
            if (err) {
                throw err
            }
            else {
                res.status(200).json({
                    status: {
                        success: true,
                        code: 200,
                        msg: [
                            'Dashboard'
                        ]
                    },
                    data: {
                        user
                    }
                })
            }
        })
    }
    else {
        res.status(200).json({
            status: {
                success: false,
                code: 200,
                msg: [
                    'Login'
                ]
            }
        })
    }
})

// GET @ Register
router.get('/profilepg', (req, res) => {
    res.status(200).json({
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

// GET @ Edit Profile
router.post('/edit/:id', (req, res) => {
    console.log(req.params.i)
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
    })
    User.update({ _id: req.params.id }, {
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
        }
    }, (err) => {
        if (err) {
            throw err
        }
        else {
            res.status(20).json({
                status: {
                    success: true,
                    code: 20,
                    msg: [
                        'Updated. Changes might take some time to reflect.'
                    ]
                }
            })
        }
    })
})

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
        console.log("User phone:"+ (req.body.phone))
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
        })

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
                    res.status(500).json({
                        status: {
                            success: false,
                            code: 500,
                            msg: [
                                err
                            ]
                        }
                    });
                // }
            }
            else {
                console.log(newUser._id)
                req.session.user = newUser._id;
                console.log("Redirecting to dashbd");
                res.status(201).json({
                    status: {
                        success: false,
                        code: 201,
                        msg: [
                            'User created'
                        ]
                    }
                })
            }
        });
    });

module.exports = router;
