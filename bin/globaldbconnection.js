const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

class GlobalConnection{
    // this func will make db available to this class
    static connectToMongoClient(){
        if(this.db) return Promise.resolve(this.db);
      else{
        let client = new MongoClient(this.url);
        client.connect((err) =>{
            assert.equal(null, err);
            this.db = client.db(this.dbName);
            console.log("Connected through Global MongoClient"+ this.db);
            
            return (this.db);
        })
    } 
 }
}

GlobalConnection.db = null;
GlobalConnection.dbName = "insurance";
GlobalConnection.url = 'mongodb+srv://admin:qwerty123456@insurance-rktib.mongodb.net/insurance?retryWrites=true&w=majority';

module.exports = { GlobalConnection };