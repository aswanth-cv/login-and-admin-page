
const User = require('../models/userModel.js')
const bcrypt = require('bcrypt');
const randomstring=require('randomstring');
const config = require('../config/config.js')

const securePassword= async (password)=>{
try{

  const passwordHash = await bcrypt.hash(password,10);
  return passwordHash;
}catch(error){
  console.log(error.message);
} 
}


const loginLoad = (req, res) => {
  res.render('admin/login');
};


const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.admin === 0) {
          res.render('admin/login', { message: "Invalid Email and password" })
        }
        else {
          req.session.admin_id =  userData._id
          res.redirect("/admin/home")
        }
      } else {
        res.render('admin/login', { message: "Invalid Email and password" })
      }

    } else {
      res.render('admin/login', { message: "Invalid Email and password" })
    }
  } catch (error) {
    console.log(error.message)

  }
}

const loadDashboard = async (req, res) => {
  try {
   const userData = await User.findById({_id:req.session.admin_id})
    res.render('admin/home',{admin:userData});
  } catch (error) {
    console.log(error.message)
  }
}


const adminLogout=async(req,res)=>{
  try{
    req.session.admin_id = null;
    if(!req.session.user_id){
      res.clearCookie('sankar.sid')
    }
    res.redirect('/admin')
  }catch(error){
   console.log(error.message)
  }
}

const adminDashboard= async(req,res)=>{
  try{
const userData= await User.find({is_admin:0})

res.render('admin/dashboard',{users:userData})
  }catch(error){
  console.log(error.message)
  }
}


//new user
const newUserLoad=async(req,res)=>{
  try{
    res.render('admin/new-user');

  }catch(error){
    console.log(error.message)
  }
}


//add user

const addUser=async(req,res)=>{
  try{
    const name=req.body.name;
    const email=req.body.email;
    const password=randomstring.generate(8);
   const spassword= await securePassword(password)

  const user=  new User({
  name:name,
  email:email,
  password:spassword,
  is_admin:0
  })
  const userData=await user.save();
   
if(userData){
res.redirect('/admin/dashboard')
}else
{
res.render('admin/new-user',{message:'something wrong'})
}
  }catch(error){
    res.render('admin/new-user',{message: error})
    console.log(error.message)
  }
}

const editUser=async(req,res)=>{
  try{
    const id=req.query.id;
    const userData= await User.findById({_id:id});
    if(userData)
    {
    res.render('admin/edit-user',{user:userData})
    }
    else
    {
      res.redirect('admin/dashboard')
    }
  }catch(error){
    console.log(error.message)
  }
}

//update user

const updateUser=async(req,res)=>{
  try{
const userdata = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,is_verified:req.body.verify}})
res.redirect('/admin/dashboard')

  }catch(error){
    console.log(error.message)
  }
}

const deleteUser=async(req,res)=>{
  try{
const id=req.query.id;
await User.deleteOne({_id:id})
res.redirect('/admin/dashboard')
  }catch(error){
    console.log(error.message)
  }
}

module.exports = {
  loginLoad, verifyLogin, loadDashboard,adminLogout,adminDashboard,newUserLoad,addUser,editUser,updateUser,deleteUser
};