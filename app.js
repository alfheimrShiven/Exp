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
const user = require('./routes/user');
var { GlobalConnection } = require('./bin/globaldbconnection');

// Database connection
const uri= 'mongodb+srv://admin:qwerty123456@insurance-rktib.mongodb.net/insurance?retryWrites=true&w=majority';
const dbName = "insurance";
// Through Mongoose
let db = mongoose.connect(uri, {
  useNewUrlParser: true
}).then(console.log("Connected using Mongoose"))
.catch(err => console.log("Mongoose Error came"+ err));

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
