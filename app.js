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
const uri= 'mongodb+srv://admin:n4W1T1HFVUaM3v56@insurance-rktib.mongodb.net/test?retryWrites=true';
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
  let modelArr=[];
  const vehicle_collection = dbclient.collection("vehicles");
  vehicle_collection.find({"make": make}).toArray((err, docursor)=>{
      if(err)
          console.log("Error while finding manufacturer:"+ err);
      else{
          console.log("Got something in the cursor");
          
          let i=0;
          docursor.forEach((element)=>{
            // avoiding the repeative model entries
            if(modelArr[i-1] != element.model){
            modelArr[i] = element.model
              ++i;
            }
          });
          res.send(modelArr);
      }
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
