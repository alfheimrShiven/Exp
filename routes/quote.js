// Dependencies
const express = require('express')
const phone = require('phone')
const router = express.Router();
var {GlobalConnection} = require('../bin/globaldbconnection');

// Files
const QuickQuote = require("../models/quickQuote");
//Global Variables
let makemodels=[]; // storing model elements with varients 
let modelvarient=[]; // storing just model varient elements

// getting maincode(vehiclecode)
// Step1: Getting all the models from the choosen manufacturer
router.post("/quick/getVehicleModels", (req, res) =>{
    let make = String(req.body.make);
    console.log("User selected manufacturer:"+ make);
    let modelArr=[]; // return models to user
    if(GlobalConnection == null)
        console.log("Global Connection is null");
    else    
        console.log("Global Connection is not null"+ GlobalConnection.db);
    const vehicle_collection = GlobalConnection.db.collection("vehicles");
    vehicle_collection.find({"make": make}).toArray((err, docursor)=>{
        if(err)
            console.log("Error while finding manufacturer:"+ err);
        else{
            console.log("Got something in the cursor");
            
            let i=0, m=0;
            docursor.forEach((modelelement)=>{
              // storing the models manufactured
              makemodels[m++]= modelelement; 
              // avoiding the repeative model entries
              if(modelArr[i-1] != modelelement.model){
              modelArr[i] = modelelement.model
                ++i;
              }
              console.log("Stored this model doc:"+ makemodels[m-1]);
            });
            res.send(modelArr);
        }
    });
  });
  
  // Step2: Getting the varients of the choosen model
    router.post("/quick/modelvarient", (req,res)=>{
        let model = String(req.body.model);
        console.log("User want varients for this model:"+ model);
        console.log("Will be one in:"+ makemodels.length);
        let varients=[];
        let i=0;
        makemodels.forEach((modelElement)=>{
          if(modelElement.model == model){
            varients[i] = modelElement.varient;
            modelvarient[i] = modelElement;
            i++; 
          }
          });
        // res.send(varients);
        res.json({varients: [varients]});
    });
  
    // Step 3: Finally getting the maincode or the vehicle code
    router.post("/quick/maincode", (req,res)=>{
      let uservarient = req.body.uservarient;
      modelvarient.forEach((modelvarientElem) =>{
        if(modelvarientElem.varient == uservarient)
          res.send(modelvarientElem);
        else
          res.send("Cannot get the maincode");
      });
    });
   


router.get('/quick/save', (req, res) => {
    res.render('quickQuoteRequest', {
        status: {
            success: true,
            code: 200,
            title: 'Quick Quote'
        }
    })
})

router.post('/quick/save', (req, res) => {
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
                });
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
