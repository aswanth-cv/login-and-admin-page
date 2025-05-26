const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/userModel.js')
const randomstring = require("randomstring");
const config = require('../config/config.js')


const securePassword = async (password) => {
  try {

    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
}






//reset password
const resetpassword = async (name, email, token) => {
  try {

    const transporter = nodemailer.createTransport({

      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    })

    const mailOptions = {
      from: 'sankar.gw77@gmail.com',
      to: email,
      subject: 'For Reset Password',
      html: '<p>Hii ' + name + ',please click here to <a href="http://localhost:3002/Forget-Password?token=' + token + '">Reset</a> your password.</p>'
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("Email has been sent:- ", info.response);
      }


    })

  } catch (error) {
    console.log(error.message);
  }

}



const loadRegister = async (req, res) => {
  try {
    res.render('users/registration')
  } catch (error) {
    console.log(error.message)
  }
}

const insertUser = async (req, res) => {

  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: spassword,
      is_admin: 0,
      is_verified:true
    })

    const userData = await user.save();
    if (userData) {

      

      res.render('users/registration', { message: "Your registration was successful. You can now log in." });

    }
    else {
      res.render('users/registration', { message: "Your Registration has been failed." })
    }
  } catch (error) {
    console.log(error)
    res.render('users/registration', { message: "Your Registration has been failed." })
  }
}



//login

const loginLoad = async (req, res) => {
  try {
    res.render('users/login');

  } catch (error) {
    console.log(error.message);
  }
}

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!userData.is_verified) {
  return res.render('users/login', { message: "Your account is not verified. Please wait for admin approval." });
}


      if (passwordMatch) {
        req.session.user_id = userData._id;
        res.redirect('users/home');
      } else {
        res.render('users/login', { message: "Invalid Username and Password" });
      }
    } else {
      res.render('users/login', { message: "Invalid username and password" })
    }
  } catch (error) {
    console.log(error.message)
  }
}

const loadHome = async (req, res) => {
  try {
    const userData = await User.findById(req.session.user_id);
    res.render('users/home', { user: userData });
  } catch (error) {
    console.log(error.message);
    res.render('users/home', { user: userData });
  }
};



const userLogout = async (req, res) => {
  try {
    req.session.user_id = null;
    if(!req.session.admin_id){
      res.clearCookie('sankar.sid')
    }
    res.redirect('/');
  } catch (error) {
    console.log(error.message)
  }
}


const forgetLoad = async (req, res) => {
  try {
    res.render('users/forget');
  } catch (error) {
    console.log(error.message)
  }
}
//reset password

const forgetVerify = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });

    if (!userData) {
      return res.render('users/forget', { message: "Invalid Email" });
    }

    const token = randomstring.generate();
    await User.updateOne({ email: email }, { $set: { token: token } });
    await resetpassword(userData.name, userData.email, token);

    return res.render('users/forget', { message: "Please check your email to reset your password." });

  } catch (error) {
    console.log(error.message)
  }
};

const passwordLoad = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });

    if (tokenData) {
      res.render('users/forget-password', { user_id: tokenData._id })
    }
    else {
      res.render('404', { message: "Token is invalid." })
    }
  } catch (error) {
    console.log(error.message)
  }
}

const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;
    const secure_password = await securePassword(password)
    const updatedData = await User.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_password, token: '' } })
    res.redirect("/")
  } catch (error) {
    console.log(error.message)
  }
}


module.exports = {
 insertUser, loginLoad, verifyLogin, loadHome, userLogout, forgetLoad, forgetVerify, passwordLoad, resetPassword,loadRegister 

}