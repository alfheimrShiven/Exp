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
const session = require('express-session')

//importing the routes(endpoints)
var indexRoute = require('./routes/index');
var usersRoute = require('./routes/users');
var verifyRoute = require('./routes/verify');
var sampleRoute = require('./routes/sample');
const quote = require('./routes/quote')
const user = require('./routes/user')

// Database connection
const db = mongoose.connect(process.env.DB, {
  useNewUrlParser: true
})
mongoose.connection.once('open', () => {
  console.log('Connection successfully made')
}).on('error', function(error) {
  console.log(error)
})

// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

// Flash messages
app.use(flash())

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
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

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//adding middlewares libraries to our request handling chain
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // serving the static files
app.use(cors());

app.use('/', indexRoute);
app.use('/users', usersRoute); 
app.use('/verify', verifyRoute);
app.use('/user', user)
app.use('/quote', quote)


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
