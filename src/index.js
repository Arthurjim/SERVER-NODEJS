const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require("./controllers/index-controller");
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const app = express();
require('dotenv').config();
const initializePassport = require("./passportConfig")
initializePassport(passport);
//middlewares
//funciones que se ejecutan antes de llegar a las rutas
//método incorporado en express para reconocer el objeto de solicitud entrante como objeto JSO

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


app.use(require('./routes/routes'));

app.listen(process.env.PORT);
console.log(`Server on PORT ${process.env.PORT}`)