const mongoose=require("mongoose");
const userschema= new mongoose.Schema({
 name:{
 type:String,
 required:true
},
email:{
  type:String,
  required:true
},

password:{
   type:String,
  required:true
},
is_admin:{
  type:Number,
  required:true
},
  is_verified: {
    type: Boolean,
    default: false
},
token:{
  type:String,
  default:' '
}
});
module.exports=mongoose.model('user',userschema);