// DOTENV
require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path'); // for parsing files and directory paths
var cookieParser = require('cookie-parser'); // to work with cookies
var logger = require('morgan'); //http logger middleware  
var cors= require('cors');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient
, assert = require('assert');
const session = require('express-session')

//importing the routes(endpoints)
var indexRoute = require('./routes/index');
var verifyRoute = require('./routes/verify');
const quote = require('./routes/quote')
const user = require('./routes/user')

// Database connection
const uri= 'mongodb+srv://admin:qwerty123456@insurance-rktib.mongodb.net/insurance?retryWrites=true&w=majority';
const dbName = "insurance";
// Through Mongoose
let db = mongoose.connect(uri, {
  useNewUrlParser: true
}).then(console.log("Connected using Mongoose"))
.catch(err => console.log("Mongoose Error came"+ err));

// Through MongoClient
const client=new MongoClient(uri);
let dbclient = null;
client.connect((err) =>{
  assert.equal(null, err);
  console.log("Connected through MongoClient");
  dbclient = client.db(dbName);
  
})
var app = express();

//Global Variables
let makemodels=[]; // storing model elements with varients 
let modelvarient=[]; // storing just model varient elements
// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

// Flash messages
app.use(flash())

// Session
app.use(session({
    secret: 'HODOR',
    resave: false,
    saveUninitialized: true
}))

// Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        const namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']'
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        }
    }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//adding middlewares libraries to our request handling chain
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname, { dotfiles: 'allow' } ));

app.use(cors());

app.use('/', indexRoute);
app.use('/verify', verifyRoute);
app.use('/user', user);
app.use('/quote', quote);

// just playing. trying to crack the MainCode 
app.post("/getVehicleModels", (req, res) =>{
  let make = String(req.body.make);
  console.log("User selected manufacturer:"+ make);
  let modelArr=[]; // return models to user
  const vehicle_collection = dbclient.collection("vehicles");
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

  app.post("/modelvarient", (req,res)=>{
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

  app.post("/maincode", (req,res)=>{
    let uservarient = req.body.uservarient;
    modelvarient.forEach((modelvarientElem) =>{
      if(modelvarientElem.varient == uservarient)
        res.send(modelvarientElem);
      else
        res.send("Cannot get the maincode");
    });
  });
  



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

 // render the error page
  res.status(err.status || 500);
  res.render('error', {"error":res.locals.error});
});



module.exports = app;
