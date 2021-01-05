const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const ejs = require('ejs');

var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

// import routes
const customerRoutes = require("./routes/api/customers");
const serviceProviderRoutes = require("./routes/api/service_provider");
const renderRouters = require("./routes/renderRoutes");


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



// routes middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client

app.use(flash());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  //cookie: { maxAge: 60000 }
}));




app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder

app.use(cookieParser('keyboard cat'))


app.get('*', function (req, res, next) {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});


app.use("/api", customerRoutes);
app.use("/api", serviceProviderRoutes);

app.use("/", renderRouters);

app.get('/', (req, res) => res.render('index'));



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
