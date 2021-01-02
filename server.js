const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

// import routes
const customerRoutes = require("./routes/api/customers");
const serviceProviderRoutes = require("./routes/api/service_provider");

const app = express();


// Passport middleware
app.use(passport.initialize());

// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Database Connected"))
  .catch(err => console.log(err));




app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder


var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  //cookie: { maxAge: 60000 }
}));
app.use(flash())
app.get('*', function (req, res, next) {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});


// routes middleware
app.use("/api", customerRoutes);
app.use("/api", serviceProviderRoutes);


//for rendering ejs files 
app.get('/intro', (req, res) => {
  res.render('intro');
});
app.get('/signup-service-provider', (req, res) => {
  res.render('signup-service-provider');
});
app.get('/index', (req, res) => res.render('index'));




const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
