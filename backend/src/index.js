//first i express,dotenv,cookie-parser
const express=require("express");
const cookie=require("cookie-parser");
require("dotenv").config();
const app= express();
const main=require("./config/DB");
const  userClient=require("./config/Redis");
const userauth=require("./Routes/userauth");
const prblmRouter=require("./Routes/prblmCreator");
const submitRouter=require("./Routes/submitRouter");
const aiRouter=require("./Routes/aiRouter");
const cors=require("cors");
const discussRouter=require("./Routes/discussRouter");
const videoRouter=require("./Routes/videoRouter");
const imageRouter=require("./Routes/imageRouter");
const payRouter=require("./Routes/payRouter");

app.use(cors({
   origin:"http://localhost:5173",
   credentials:true
}));
app.use(cookie());
app.use(express.json());

 app.use("/userauth",userauth);
 app.use("/prblm",prblmRouter);
 app.use("/submit",submitRouter);
 app.use("/ai",aiRouter);
 app.use("/discuss",discussRouter);
 app.use("/video",videoRouter);
 app.use("/image",imageRouter);
 app.use("/pay",payRouter);

const initializer= async ()=>{
   try{   
   await Promise.all([userClient.connect(),main()]);
   console.log("DB Connected");
   
   app.listen(process.env.PORT_NUMBER,()=>{
      console.log(`Listening at port no:${process.env.PORT_NUMBER}`);
   })
   }catch(e){
     console.log("Error: "+e);
   }
}

initializer();

// 1@#Vk6zccfx   Varshith