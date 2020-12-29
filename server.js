const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

// import routes
const customerRoutes = require("./routes/api/customers");
const serviceProviderRoutes = require("./routes/api/service_provider");


const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// DB Config
const db = require("./config/keys").mongoURI;
// routes middleware
app.use("/api", customerRoutes);
app.use("/api", serviceProviderRoutes);

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Database Connected"))
  .catch(err => console.log(err));

app.use(express.static(__dirname + '/client'));
app.get("/index.html", (req, res) => res.send(""));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
