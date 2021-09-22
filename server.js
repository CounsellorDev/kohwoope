// Dependencies
const express = require("express");
const app = express();
const port = process.env.PORT;
const logger = require("morgan");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const passport = require("passport");
require("./config/passport").passport;
const flash = require("connect-flash");

// ======setting up the morgan middleware====
app.use(logger("dev"));
// ======setting parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(
  session({
    cookie: {
      maxAge: 180 * 60 * 1000,
    },
    secret: "dfskfgsdfbcdncdsfsgkflsfabdasduaegefdblakhslkjdfsjkdfbsdk",
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      db: "mydb",
    })
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success");
  res.locals.error_messages = req.flash("error");
  res.locals.user = req.user ? true : false;
  res.locals.session = req.session;
  next();
});

//setting view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, '/public')));

// Database connections
mongoose.Promise = global.Promise;
const MONGO_URL = require("./config/db").MONGOURL;
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(`Database Connection failed ${err.message}`));

// route to handle all get requests
app.use("/", require("./routes/index"));
app.use("/", require("./routes/registerRoutes"));
app.use("/", require("./routes/invest"))

// listen on port
app.listen(port, () => {
  console.log("Server running on port " + port);
});
