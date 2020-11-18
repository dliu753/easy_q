const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const connDB = require('./config/db');

// Load config file
dotenv.config( { path: './config/config.env' });

// Load passport config
require('./config/passport')(passport);

// Connect app to mongoDB
connDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override: allows use of DELETE method in templates
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Morgan Logging in Dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
};

// Handlebars Helper functions
const { formatDate } = require('./helpers/hbs');

// Handlebars for templates with hbs extensions
app.engine('.hbs', exphbs({ helpers: {
  formatDate,
}, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static public folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/queue', require('./routes/queue'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on PORT: ${PORT}`));

