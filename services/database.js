const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

require('dotenv').config();

const connectionDB = async () => {

    const dbString = process.env.DB_STRING;

    const dbOptions = {
     useNewUrlParser: true,
     useUnifiedTopology: true
    }

    const connection = await mongoose.connect(dbString, dbOptions);
 
}

module.exports = connectionDB;
