var express = require('express');
var router = express.Router();
const SendOtp = require('sendotp');
const sendotp = new SendOtp('276430AcwaajUN7Z5cd9457f');
let phoneNo="0";

console.log("Inside verify.js file");

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

router.post('/code', function(req, res){
    console.log("User entered this OTP:"+ (req.codeJson.otp));
    // res.send("VERIFIED: Entering app");
    // let phone= otpJson.phone;
    let otp= req.codeJson.otp;
    //verify the otp
    sendotp.verify(phoneNo, otp, function(error, data){
        if(error)  {
            console.log("OTP verification failed");
            res.render('error');
        }
        else if(data.type == 'success') {
            console.log("OTP verified");
            res.send({isVerified: true});
    }
        else if(data.type == 'error') {
            console.log("OTP verification failed");
            res.render('error');
        }
        return res.send();
    });

    
});



module.exports = router;
