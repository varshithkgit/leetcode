const express=require("express");
const userauth=express.Router();
const {login,logout,register,adminRegister,delProfile,editProfile,getProfile}=require("../controller/userAuthentication");
const authorization = require("../middleware/authorization");
const adminAuthorization=require("../middleware/adminAuthorization")

userauth.post("/register",register);
userauth.post("/login",login);
userauth.post("/logout",authorization,logout);
userauth.delete("/deleteProfile",authorization,delProfile);
userauth.patch("/editProfile",authorization,editProfile);
userauth.get("/getProfile",authorization,getProfile);
userauth.get("/check",authorization,(req,res)=>{
    try{
       const reply={
          firstname:req.result.firstname,
          emailID:req.result.emailID,
          _id:req.result._id,
          role:req.result.role
        };

        res.status(201).json({
          user:reply,
          message:"Checked Successfully"
        });
    }catch(e){
        res.status(400).send("Error: "+e);
    }
});

// M-1 userauth.post("/admin/register",authorization,adminRegister)

// M-2:-
userauth.post("/admin/register",adminAuthorization,adminRegister);

module.exports=userauth;