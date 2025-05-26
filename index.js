const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/userMange");


const express=require("express");
const app=express();
app.set('views', './views'); // nokkanam
const bodyParser=require('body-parser');
const session=require('express-session');
const config = require("./config/config.js");
const auth=require("./middleware/auth.js");
const path = require('path');
const expresslayout  = require('express-ejs-layouts')

app.use(session({
  name: 'sankar.sid',
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false
}));
app.use(expresslayout);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine','ejs');
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }))


//for user routes
const userRoute=require('./routes/userRoute.js');
app.use('/',userRoute)


//for admin routes
const adminRoute=require('./routes/adminRoute');
app.use('/admin',adminRoute)

app.listen(3002,()=>{
  console.log("server is running...")
});