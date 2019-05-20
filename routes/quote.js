// Dependencies
const express = require('express')
const phone = require('phone')
const router = express.Router()

// Files
const QuickQuote = require("../models/quickQuote")

router.get('/quick', (req, res) => {
    res.render('quickQuoteRequest', {
        status: {
            success: true,
            code: 200,
            title: 'Quick Quote'
        }
    })
})

router.post('/quick', (req, res) => {
    if (!req.session.user) {
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
    }
    else {
        const newQuickQuote = new QuickQuote({
            quickQuoteRequest: req.body.quickQuoteRequest,
            user: {
                phone: req.session.user.phone,
                name: req.session.user.fname + ' ' + req.session.user.lname
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
})

module.exports = router;
