const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// app init
const app = express();
app.use(express.json());


// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import mongoDB uri
const database = process.env.MONGODB_URI;

// connect to database
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // additional options if needed
  })
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => console.log('db connection error'));

// Passport middleware

app.use(
  session({
    secret: 'gr8',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// passport config
require('./config/passport')(passport);

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.options('*', cors());
// routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);
app.get('/', (req, res) => {
  console.log('home');
  res.send('Server is running');
});

// serve static assets if in production mode

// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   app.use(express.static("../client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));
