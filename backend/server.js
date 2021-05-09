const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require("passport");
require('dotenv').config()
const PORT = 4000 | process.env.PORT;

// routes
var ApplicantRouter = require("./routes/applicant");
var RecruiterRouter = require("./routes/recruiter");
var authRouter = require('./routes/auth') 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
const mongoURI = process.env.mongoURI;

// Connect to Mongo
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// passport middleware
app.use(passport.initialize());
require("./passport_conf")(passport);

// setup API endpoints
app.use("/applicant", ApplicantRouter);
app.use("/recruiter", RecruiterRouter);
app.use("/", authRouter);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
