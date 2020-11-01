const { Router }  = require('express');
const passport = require("passport");
const router = Router();
const initializePassport = require("../passportConfig");

initializePassport(passport);
const {getUsers, addUsers, getUltimo, getOne, getVencidos,getListDate,addListDate,oneDelete, updateUser,register} = require('../controllers/index-controller.js');

router.get('/usuarios', getUsers);
router.post('/usuarios/add', addUsers);
router.get('/usuarios/final', getUltimo);
router.get('/usuarios/:id', getOne);
router.get('/vencidos',getVencidos);
router.get('/calendario/:day',getListDate);
router.post('/calendario/add',addListDate);
router.get('/delete/:id',oneDelete);
router.put('/actualizar/:id', updateUser);
router.post('/register', register)
router.post('/users/login',passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: "/users/login",
  failureFlash:true
}));
module.exports = router;

//npm i express-flash express-session passport passport-local bcrypt dotenv

