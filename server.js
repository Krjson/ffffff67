const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const routes = require('./routes/routes');
const startServer = require('./serverStart');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});


app.use(session({
    secret: process.env.SEKRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store
}));


app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img/avatars', express.static(__dirname + '/public/img/avatars'));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

startServer(app);