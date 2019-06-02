// Dependencies
const express = require('express')

// Files
const User = require('../models/users')
const CarPolicy = require('../models/carPolicies')

// Initialize router
const router = express.Router()

// GET @ Save Purchase
router.get('/save/car-policy', (req, res) => {
    res.status(200).json({
        status: {
            success: true,
            code: 202,
            msg: 'Saving Car Policy'
        }
    })
})

// POST @ Save Purchase
router.post('/save/car-policy', (req, res) => {
    console.log(req.session.user + "{}{}{}" + req.body.user)
    if (!req.session.user) {
        res.send(401).json({
            status: {
                success: false,
                code: 401,
                msg: [
                    'Please login to purchase any Policy'
                ]
            }
        })
    }
    else if (req.session.user === req.body.user) {
        console.log(req.session.user + "{}{}{}" + req.body.user)
        let newCarPolicy = new CarPolicy({
            quoteNumber: req.body.quoteNumber,
            plan: {
                date: {
                    to: req.body.planDateTo,
                    from: req.body.planDateFrom
                },
                discountCurrentPolicy: req.body.discountCurrentPolicy,
                coverages: req.body.coverages,
                addOns: req.body.planAddOns,
                deduct: req.body.deduct,
                invoice: req.body.invoice
            },
            premium: {
                ownDamage: {
                    ownDamagePremium: req.body.ownDamagePremium,
                    addOns: req.body.ownDamagePremiumAddOns,
                    discount: req.body.discount
                },
                liabilityPremium: {
                    basicThirdParty: req.body.basicThirdParty,
                    coverForOwner: req.body.coverForOwner,
                    legalOperation: req.body.legalOperation,
                    biFuelKit: req.body.biFuelKit,
                    coverPassengers: req.body.coverPassengers,
                    legalLiabilityPaidDriver: req.body.legalLiabilityPaidDriver
                },
                user: {
                    id: req.body.user
                }
            }
        })
        console.log(newCarPolicy)
        User.findById(req.body.user)
        .then(user => {
            console.log(user)
            if (!user) {
                res.status(401).json({
                    status: {
                        success: false,
                        code: 401,
                        msg: [
                            'Unauthorized User'
                        ]
                    }
                })
            }
            else {
                newCarPolicy.save((err, carPolicy) => {
                    if (err) {
                        throw err
                    }
                    else {
                        User.update({ _id: req.body.user }, {
                            $push: {
                                userCarPolicies: carPolicy._id
                            }
                        }, (err) => {
                            if (err) {
                                throw err
                            }
                            else {
                                res.status(202).json({
                                    status: {
                                        success: true,
                                        code: 202,
                                        msg: [
                                            'Successfull Purchase'
                                        ]
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        .catch(err => { throw err })
    }
    else {
        res.status(401).json({
            status: {
                success: false,
                code: 401,
                msg: [
                    'Unauthorized User'
                ]
            }
        })
    }
})

module.exports = router
