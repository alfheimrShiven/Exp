// Dependencies
const express = require('express')
const phone = require('phone')
const router = express.Router()

// Modules
const QuickQuote = require("../models/quickQuote")
const RTO = require("../models/rtos")

// GET @ Quick Quote
router.get('/quick/save', (req, res) => {
    res.render('quickQuoteRequest', {
        status: {
            success: true,
            code: 200,
            title: 'Quick Quote'
        }
    })
})

// POST @ Extract RTO code
router.post('/extract/permit', (req, res) => {
    RTO.find({
        registeredCityName: req.body.city.toUpperCase(),
        registeredStateName: req.body.state.toUpperCase()
    }, (err, rtoCode) => {
        if (err) {
            throw err
        }
        else if (rtoCode.length === 0) {
            res.status(404).json({
                status: {
                    success: true,
                    code: 404,
                    msg: [
                        'No RTO code found'
                    ]
                }
            })
        }
        else {
            res.status(200).json({
                status: {
                    success: true,
                    code: 200,
                    msg: [
                        'RTO code found'
                    ]
                },
                data: {
                    rtoCode: rtoCode[0].rtoCode
                }
            })
        }
    })
})

// POST @ Quick Quote
router.post('/quick', (req, res) => {
    // if (!req.session.user) {
        if (req.body.name && req.body.phone) {
            const msg = []
            if (phone(req.body.phone).length == 0) {
                msg.push("Invalid Phone number")
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
                const newQuickQuote = new QuickQuote({
                    quickQuoteRequest: req.body.quickQuoteRequest,
                    user: {
                        phone: req.body.phone,
                        name: req.body.name
                    }
                })
                newQuickQuote.save((err, newQuickQuote) => {
                    if (err) {
                        throw err
                    }
                    else {
                        res.send({
                            status: {
                                success: true,
                                code: 201,
                                msg: [
                                    'Request saved'
                                ]
                            }
                        })
                    }
                })
            }
        }
    // }
    // else {
    //     const newQuickQuote = new QuickQuote({
    //         quickQuoteRequest: req.body.quickQuoteRequest,
    //         user: {
    //             phone: req.session.user.phone,
    //             name: req.session.user.fname + ' ' + req.session.user.lname
    //         }
    //     })
    //     newQuickQuote.save((err, newQuickQuote) => {
    //         if (err) {
    //             throw err
    //         }
    //         else {
    //             res.send({
    //                 status: {
    //                     success: true,
    //                     code: 201,
    //                     msg: [
    //                         'Request saved'
    //                     ]
    //                 }
    //             })
    //         }
    //     })
    // }
})

module.exports = router;
