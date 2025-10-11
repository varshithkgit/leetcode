const express=require("express");
const {getDigitalSignature,storeMetaData,delMetaData}=require("../controller/userPhoto");
const imageRouter=express.Router();
const authorization=require("../middleware/authorization");

imageRouter.get("/digiSign",authorization,getDigitalSignature);
imageRouter.post("/storeMetaData",authorization,storeMetaData);
imageRouter.delete("/delMetaData",authorization,delMetaData);

module.exports=imageRouter;