//require the library
require('dotenv').config();
const mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb+srv://${process.env.mongo_db}@cluster0.kzjhl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

//acquire the connection to check if it is connected 
const db=mongoose.connection;

//error
db.on('error',console.error.bind(console,'error connecting to db'));

//up and running then print the message
db.once('open',function(){
    console.log('successfully connected to the database');
});
module.exports=db;