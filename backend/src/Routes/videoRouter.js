const express=require("express");
const videoRouter=express.Router();
const {getDigitalSignature,storeMetaData,delMetaData}=require("../controller/userVideos");
const adminAuthorization=require("../middleware/adminAuthorization");

videoRouter.get("/getDigitalSignature/:prblmId",adminAuthorization,getDigitalSignature);
videoRouter.post("/storeMetaData",adminAuthorization,storeMetaData);
videoRouter.delete("/delMetaData/:vid",adminAuthorization,delMetaData);

module.exports=videoRouter;