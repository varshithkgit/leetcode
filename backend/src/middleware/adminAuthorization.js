const jwt=require("jsonwebtoken");
const userClient=require("../config/Redis");
const SchemarModel=require("../Model/Schema");

const adminAuthorization= async (req,res,next)=>{
   try{
    const {token}=req.cookies;

    if(!token)
        throw new Error("No token exist");

    const payload=jwt.verify(token,process.env.SECRET_KEY);

    const {_id}=payload;

    if(!_id)
        throw new Error("Invalid Token");

    const user= await SchemarModel.findById(_id);

    if(payload.role!="admin"){
       throw new Error("Role not equal to admin")
    }

    if(!user)
        throw new Error("There is no user");

    req.result=user;

    const isAccessable= await userClient.exists(`token:${token}`);
  
    if(isAccessable)
        throw new Error("token has logged out")

    next(); 
   }catch(e){
    res.status(401).send("Error: "+e);
   }
}

module.exports=adminAuthorization;