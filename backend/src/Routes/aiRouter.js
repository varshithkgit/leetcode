const express=require("express");
const aiRouter= express.Router();
const aiChat=require("../controller/aiChat");
const authorization=require("../middleware/authorization");

aiRouter.post("/chat",authorization,aiChat);

module.exports=aiRouter;