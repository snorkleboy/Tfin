const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');         // For serving a basic web page.
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const FetchSaveMosts = require('../bin/data/fetchSaveMosts');
const router = require('./routes/router');
const app = express();
var cookieSession = require('cookie-session')


    // Here we find an appropriate database to connect to, defaulting to
    // localhost if we don't find one.
const temp ="mongodb://<dbuser>:<dbpassword>@ds115446.mlab.com:15446/heroku_b8c2zknk"
const uristring = process.env.MONGOLAB_URI || process.env.MONGODB_URI ||  process.env.MONGOHQ_URL ||  'mongodb://localhost/mern-crud';

    // The http server will listen to an appropriate port, or default to
    // port 5000.
    const theport = process.env.PORT || 5000;

    // Makes connection asynchronously.  Mongoose will queue up database
    // operations and release them when the connection is complete.

//mongo
//


mongoose.connect(uristring, { promiseLibrary: require('bluebird') }, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
        FetchSaveMosts();
      }
    });

  //middleware = function((req,res,next)=>{}) express() and express().router are valid middlewares
app.use(cookieSession({
  name: 'session',
  keys: ['9879h9fh8934hf34fknkjnd139pud','23p982h39hdfojafnskfjan','apsfhiq9rh9pfuansojktrlc'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
// app.use(Fetcher);
app.use(router);
app.use(express.static(path.join(__dirname, '../build')));
app.use('*',express.static(path.join(__dirname, '../build')));



module.exports = app;