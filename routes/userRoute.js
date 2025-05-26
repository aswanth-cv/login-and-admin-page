const express = require("express");
const user_route = express.Router();
const auth = require('../middleware/auth');

const {
  insertUser,
  loadRegister,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  forgetLoad,
  forgetVerify,
  passwordLoad,
  resetPassword
} = require('../controllers/userController');


express().set('views','./views/users')


user_route.get('/register', auth.isLogout, loadRegister);
user_route.post('/register', insertUser);
user_route.get('/login', auth.isLogout, loginLoad);
user_route.post('/login', verifyLogin);
user_route.get('/users/home', auth.isLogin, loadHome);
user_route.get('/', auth.isLogout, loginLoad);
user_route.get('/logout',auth.isLogin,userLogout)
user_route.get('/forget',auth.isLogout,forgetLoad)
user_route.post('/forget',forgetVerify)
user_route.get('/forget-password',auth.isLogout,passwordLoad)
user_route.post('/forget-password',resetPassword)


module.exports = user_route;