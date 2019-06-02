const MongoClient = require('mongodb').MongoClient, assert = require('assert')

// Database connection
const uri= 'mongodb+srv://admin:qwerty123456@insurance-rktib.mongodb.net/insurance?retryWrites=true&w=majority'
const dbName = "insurance"

// Through Mongoose
let db = mongoose.connect(uri, {
    useNewUrlParser: true
})
.then(console.log("Connected using Mongoose"))
.catch(err => console.log("Mongoose Error came"+ err))

// Through MongoClient
const client = new MongoClient(uri)
let dbclient = null
client.connect((err) => {
    assert.equal(null, err)
    console.log("Connected through MongoClient")
    dbclient = client.db(dbName)
})

module.exports = dbclient
