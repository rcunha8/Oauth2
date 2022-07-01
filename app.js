// Get the configuration values
require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');


const passport = require('passport');
const { createServer } = require('./services/server');
require('./services/passport');

const connectionDB = require('./services/database');

// const {port, https, certs} = require('./services/https');
require('./services/server');
/*  VIEW ENGINE */
app.set('view engine', 'ejs');


connectionDB()
const dbString = process.env.DB_STRING;
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: dbString,
    mongoOptions: dbOptions,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 1
  },
}));

app.use(passport.initialize());
app.use(passport.session());


require('./routes/authRoutes')(app);


// Create the server according to environment
createServer(app);

