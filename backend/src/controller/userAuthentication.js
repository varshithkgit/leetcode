const validate=require("../utilis/validate");
const bcrypt=require("bcrypt");
const SchemarModel=require("../Model/Schema");
const image=require("../Model/imageOfUser");
const jwt=require("jsonwebtoken");
const userClient=require("../config/Redis");

const register= async (req,res)=>{
     try{
        validate(req.body);
        const {emailID,password}=req.body;
        req.body.password= await bcrypt.hash(password,10);  
        req.body.role="user";
        const user=await SchemarModel.create(req.body);
        const token= jwt.sign({_id:user._id,emailID:emailID,role:'user'},process.env.SECRET_KEY,{expiresIn:3600});
        res.cookie("token",token,{maxAge:3600000});

        const reply={
          firstname:user.firstname,
          emailID:user.emailID,
          _id:user._id,
          role:user.role
        };

        res.status(201).json({
          user:reply,
          message:"registered Successfully"
        });

     }catch(err){
        console.log(err);
        res.status(400).send("Error: "+err);
     }
}

const adminRegister=async (req,res)=>{
  try{
    // M-1 continuation
    if(req.result.role!="admin"){
      throw new Error("Role not equal to admin");
    }
    validate(req.body);
    const {emailID,password}=req.body;
    req.body.password= await bcrypt.hash(password,10);  

    const user=await SchemarModel.create(req.body);
    const token= jwt.sign({_id:user._id,emailID:emailID,role:user.role},process.env.SECRET_KEY,{expiresIn:3600});
    res.cookie("token",token,{maxAge:3600000});


        const reply={
          firstname:user.firstname,
          emailID:user.emailID,
          _id:user._id,
          role:user.role
        };

    res.status(201).json({
      user:reply,
      message:"Admin Registered Successfully"
    });
    
 }catch(err){
    
    res.status(400).send("Error: "+err);
 }
}

const login= async (req,res)=>{
  try{
    const {emailID,password}=req.body;


    if(!emailID)
        throw new Error("Invalid credentials");

    if(!password)
        throw new Error("Invalid credentials");

    const user=await SchemarModel.findOne({emailID:emailID});

    if(!user)
      throw new Error("There is no account as such");

    const isAllowed=await bcrypt.compare(password,user.password);

    if(!isAllowed)
        throw new Error("Invalid credentials");
    
    const token= jwt.sign({_id:user._id,emailID:emailID,role:user.role},process.env.SECRET_KEY,{expiresIn:3600});
    res.cookie("token",token,{maxAge:3600000});

     const reply={
          firstname:user.firstname,
          emailID:user.emailID,
          _id:user._id,
          role:user.role
        };

    res.status(200).json({
          user:reply,
          message:"logged in Successfully"
        });
  }catch(err){
    console.log(err.message);
    res.status(401).send("Error "+err.message);
  }
}

const logout= async (req,res)=>{
  try{
    const token=req.cookies.token;
    const payload=jwt.decode(token);
     
    await userClient.set(`token:${token}`,"Blocked");
    await userClient.expireAt(`token:${token}`,payload.exp);

    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("Logged Out Successfully");
  }catch(e){
    res.status(503).send("Error "+e);
  }
}

const getProfile=async (req,res) => {
  try{
     const _id=req?.result?._id;

     const profile=await SchemarModel.findById(_id)?.select("college skills languages");

     if(!profile)
      throw new Error("Userprofile doesn't exist");

     const photo=await image.findOne({userId:_id});

     if(photo){
      const response={
        ...profile,
        secureUrl:photo.secureUrl,
        cloudinaryPublicId:photo.cloudinaryPublicId,
      }

      return res.status(200).send(response);
     }

     res.status(200).send(profile);
  }catch(e){
    res.status(500).send("Error: "+e);
  }
}

const editProfile=async (req,res)=>{
  try{
     const {skills,college,languages}=req.body;
     
     if(!skills)
      throw new Error("No skills added")

     if(!college)
      throw new Error("No college name added")

     if(!languages)
      throw new Error("No languages added")

     await SchemarModel.findByIdAndUpdate(req.result._id,{skills,college,languages});

     res.status(201).send("Edited ur profile successfully");
  }catch(e){
    res.status(503).send("Error "+e);
  }
}

const delProfile= async (req,res)=>{
 try{
    //deleting user from  database
    await SchemarModel.findByIdAndDelete(req.result._id);

    //del users all submissions
    //m-1
    // await submit.deleteMany({userId:req.result._id});
    
    const token=req.cookies.token;
    const payload=jwt.decode(token);
     
    await userClient.set(`token:${token}`,"Blocked");
    await userClient.expireAt(`token:${token}`,payload.exp);

    res.cookie("token",null,{expires:new Date(Date.now())})
    res.status(200).send("Deleted Successfully");
 }catch(err){
    res.status(500).send("Internal server error: "+err);
 }
}

module.exports={login,logout,register,adminRegister,delProfile,editProfile,getProfile};