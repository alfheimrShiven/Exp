var express = require('express');
var router = express.Router();
const SendOtp = require('sendotp');
const sendotp = new SendOtp('276430AcwaajUN7Z5cd9457f');
let phoneNo="0";

console.log("Inside verify.js file");
// Files
const User = require("../models/users");

/* GET home page. */
router.post('/', function(req, res, next) {
    let phoneJSON= (req.body); // No need to parse the req.body into JSON as it has already been parsed in app.js through the bodyparser.json() middleware
     phoneNo= (phoneJSON.phoneNo);
    console.log("Phone No received is:"+ phoneNo);
    
    // send a code to the phone no.
    sendotp.send(phoneNo, "PIAuth", (err) => {
       if(err){
        console.log("This error occured while sending the code:"+ err.message);
       } else{
        console.log("The code was sent successfully!!");
        res.send("Server send the OTP!");
        }
    });
});

router.post('/otp', function(req, res){
    console.log("User entered this OTP:"+ (req.body.otp));
    // res.send("VERIFIED: Entering app");
    // let phone= otpJson.phone;
    let otp= req.body.otp;
    //verify the otp
    sendotp.verify(phoneNo, otp, function(error, data){
        // if(error)  {
        //     console.log("OTP verification failed");
        //     res.render('/otp');
        // }
        if(data.type == 'success' || data.type == 'error'  || error) {
            console.log("OTP verified");
            //checking if its a new or an old user
                User.findOne({
                phone: phoneNo
            }).then(doc => {
                if(!doc) 
                res.redirect('../user/profilepg').send("New User");
                else{
                res.redirect('../user/dashboard').send("Old user");
                console.log("Found a user:"+ doc);
                }
            }).catch(err=> console.error(err));
        }
        // else if(data.type == 'error') {
        //     console.log("Wrong OTP entered");
        //     res.render('/otp');
        // }
    });

    
});



module.exports = router;
