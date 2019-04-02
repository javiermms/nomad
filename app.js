const express = require('express')
const methodOverride = require('method-override')
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
var exphbs = require('express-handlebars')
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream')

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

app.use(cookieParser()); // Add this after you initialize express

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

app.use(express.static('public'))

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var checkAuth = (req, res, next) => {
    console.log("Checking authentication");
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
      req.user = null;
    } else {
      var token = req.cookies.nToken;
      var decodedToken = jwt.decode(token, { complete: true }) || {};
      req.user = decodedToken.payload;
    }
  
    next();
  };
  app.use(checkAuth);

require('./data/nomad-db');
require('./controllers/auth.js')(app);
require('./controllers/listings.js')(app);
require('./controllers/reviews.js')(app);
require('./controllers/uploads.js')(app);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
